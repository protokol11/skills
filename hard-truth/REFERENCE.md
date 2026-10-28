# Deep module reference

Tests and definitions that separate verdict (b) "deepen" from verdict (c) "separate module".

## Definitions

**Deep module** = small interface + lots of implementation:

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
└─────────────────────┘
```

**Shallow module** = large interface + little implementation (avoid):

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

When designing an interface, ask:

- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?

## Principles

- **Depth is a property of the interface, not the implementation.** A deep module can be internally composed of small, mockable, swappable parts. They are not part of the interface. A module can have internal seams, private to its implementation, besides the external seam at its interface.
- **The deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep. Pass-through under deletion test → verdict (b). Earns its keep → verdict (c) candidate.
- **The interface is the test surface.** Callers and tests cross the same seam. If you want to test past the interface, the module is the wrong shape.
- **One adapter means a hypothetical seam. Two adapters mean a real one.** Do not introduce a seam unless something actually varies across it.

## Verdict separation

- Verdict (b): the capability stays. The interface shrinks and the implementation deepens. The deletion test shows the current shape is a pass-through.
- Verdict (c): the capability varies across real call sites or stands alone under the deletion test. Give it its own module with a deep interface.
