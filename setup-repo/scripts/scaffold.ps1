[CmdletBinding()]
param(
    [Parameter()]
    [string]$ProjectPath = ".",
    [Parameter()]
    [string]$ProjectName = "",
    [Parameter()]
    [string]$Language = "ru-en",
    [Parameter()]
    [string]$Platform = "pi",
    [Parameter()]
    [string]$RendererPath = "$env:USERPROFILE\.agents\skills\principles-render\render.mjs",
    [switch]$SkipGit,
    [switch]$OnlyMissing
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$skillRoot = Split-Path -Parent $scriptRoot
$templatesDir = Join-Path $skillRoot "templates"

$targetDir = Resolve-Path $ProjectPath -ErrorAction SilentlyContinue
if (-not $targetDir) {
    New-Item -ItemType Directory -Path $ProjectPath | Out-Null
    $targetDir = Resolve-Path $ProjectPath
}

if (-not $ProjectName) {
    $ProjectName = Split-Path -Leaf $targetDir
}

$date = Get-Date -Format "yyyy-MM-dd"

Write-Host "Bootstrapping agentic project scaffold at: $targetDir" -ForegroundColor Cyan

if (-not (Test-Path $templatesDir)) {
    Write-Error "Templates directory not found: $templatesDir"
}

function Strip-H1 {
    param([string]$Content)
    return ($Content -replace '^#\s+.*\r?\n', '')
}

function Inject-Content {
    param([string]$Path, [string]$Placeholder, [string]$Content)
    if (-not (Test-Path $Path)) { return }
    $text = Get-Content -Path $Path -Raw
    if ($text -match [regex]::Escape($Placeholder)) {
        $text = $text -replace [regex]::Escape($Placeholder), $Content
        Set-Content -Path $Path -Value $text -NoNewline
    }
}

# Render compliance package.
$renderDir = Join-Path ([System.IO.Path]::GetTempPath()) ("setup-repo-render-" + [Guid]::NewGuid().ToString())
try {
    Write-Host "Rendering compliance package..." -ForegroundColor Cyan
    if (-not (Test-Path $RendererPath)) {
        Write-Error "Renderer not found: $RendererPath"
    }
    & node `"$RendererPath`" --out `"$renderDir`"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Renderer failed with exit code $LASTEXITCODE"
    }

    $specTemplate = Strip-H1 -Content (Get-Content -Path (Join-Path $renderDir "spec-template.md") -Raw)
    $lintRules = Get-Content -Path (Join-Path $renderDir "lint-rules.md") -Raw

    $rolePrompts = @{}
    $roleDir = Join-Path $renderDir "role-prompts"
    if (Test-Path $roleDir) {
        foreach ($rf in Get-ChildItem -Path $roleDir -Filter "*.md") {
            $rolePrompts[$rf.BaseName] = Strip-H1 -Content (Get-Content -Path $rf.FullName -Raw)
        }
    }

    # Copy templates.
    $templateSubfolders = Get-ChildItem -Path $templatesDir -Directory -Force
    foreach ($subfolder in $templateSubfolders) {
        if ($subfolder.Name -eq "root") {
            $source = $subfolder.FullName
            $dest = $targetDir
        } else {
            $source = $subfolder.FullName
            $dest = Join-Path $targetDir $subfolder.Name
            if (-not (Test-Path $dest)) {
                New-Item -ItemType Directory -Path $dest | Out-Null
            }
        }
        $files = Get-ChildItem -Path $source -Recurse -File
        foreach ($file in $files) {
            $relativePath = $file.FullName.Substring($source.Length + 1)
            $destFile = Join-Path $dest $relativePath
            if ($OnlyMissing -and (Test-Path $destFile)) {
                continue
            }
            $destFileDir = Split-Path -Parent $destFile
            if (-not (Test-Path $destFileDir)) {
                New-Item -ItemType Directory -Path $destFileDir | Out-Null
            }
            Copy-Item -Path $file.FullName -Destination $destFile -Force
        }
    }

    # Replace simple placeholders in all files.
    $files = Get-ChildItem -Path $targetDir -Recurse -File
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw
        if ($content -match "\{\{(PROJECT_NAME|PROJECT_PATH|DATE|LANGUAGE|PLATFORM)\}\}") {
            $content = $content -replace "\{\{PROJECT_NAME\}\}", $ProjectName
            $content = $content -replace "\{\{PROJECT_PATH\}\}", $targetDir
            $content = $content -replace "\{\{DATE\}\}", $date
            $content = $content -replace "\{\{LANGUAGE\}\}", $Language
            $content = $content -replace "\{\{PLATFORM\}\}", $Platform
            Set-Content -Path $file.FullName -Value $content -NoNewline
        }
    }

    # Inject rendered role prompts and spec template.
    $roleMap = @{
        ".pi\agents\coder.md"   = "coder"
        ".pi\agents\tester.md"  = "tester"
        ".pi\agents\fixer.md"   = "fixer"
        ".pi\agents\explore.md" = "explore"
        ".pi\agents\plan.md"    = "plan"
    }
    foreach ($entry in $roleMap.GetEnumerator()) {
        $file = Join-Path $targetDir $entry.Key
        if ((Test-Path $file) -and $rolePrompts.ContainsKey($entry.Value)) {
            Inject-Content -Path $file -Placeholder "{{ROLE_PROMPT}}" -Content $rolePrompts[$entry.Value]
        }
    }

    Inject-Content -Path (Join-Path $targetDir ".docs\SPECS\README.md") -Placeholder "{{SPEC_TEMPLATE}}" -Content $specTemplate

    # Stamp generated lint rules.
    $violationsDir = Join-Path $targetDir ".docs\violations"
    if (-not (Test-Path $violationsDir)) {
        New-Item -ItemType Directory -Path $violationsDir | Out-Null
    }
    $lintFile = Join-Path $violationsDir "lint-rules.md"
    if ((-not $OnlyMissing) -or (-not (Test-Path $lintFile))) {
        Set-Content -Path $lintFile -Value $lintRules -NoNewline
    }
} finally {
    if (Test-Path $renderDir) {
        Remove-Item -Path $renderDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

if (-not $SkipGit -and -not (Test-Path (Join-Path $targetDir ".git"))) {
    Push-Location $targetDir
    try {
        git init | Out-Null
        git add . | Out-Null
        git -c user.email="setup-repo@local" -c user.name="setup-repo" commit -m "chore: bootstrap agentic project scaffold" | Out-Null
        Write-Host "Git initialized and initial commit created." -ForegroundColor Green
    } finally {
        Pop-Location
    }
}

Write-Host "Done." -ForegroundColor Green
