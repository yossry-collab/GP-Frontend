---
description: "Use when adding animations, transitions, page enters, reveals, hover effects, or any motion to React components. Covers Framer Motion patterns, stage-based reveals, and the GamePlug animation conventions."
---

# Framer Motion Conventions

## Entry Animations

Staggered card/list entries — each item fades up with increasing delay:

```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.08, duration: 0.4 }}
```

## Page/Tab Transitions

Wrap tab content in `<AnimatePresence mode="wait">` and give each tab a unique `key`:

```tsx
<AnimatePresence mode="wait">
  {tab === "packs" && (
    <motion.div
      key="packs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      ...
    </motion.div>
  )}
</AnimatePresence>
```

## Overlays / Modals

- Backdrop: `fixed inset-0 z-50 bg-black/60 backdrop-blur-sm`
- Animate in: `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`
- Content panel: spring scale `initial={{ scale: 0.85 }}` → `animate={{ scale: 1 }}`
- Use `onClick={(e) => e.stopPropagation()}` on inner panel to prevent close on content click

## Hover Effects

- Card lift: `whileHover={{ scale: 1.04, rotate: -2 }}`
- Keep hover animations subtle (1.02–1.06 scale max)

## Looping / Ambient Animations

For decorative background elements:

```tsx
animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
```

## Staged Reveal Pattern (Pack Opening)

Use a `revealStage` state variable cycling through phases:

1. `"charging"` — gentle pulse, build anticipation
2. `"burst"` — fast dramatic scale (0.55s)
3. `"result"` — settle into gentle infinite loop

Advance stages with `await wait(ms)` between transitions.

## Inline Styles for Dynamic Values

When background gradients or colors come from backend data (not Tailwind classes):

```tsx
// WRONG: className={`bg-gradient-to-r ${reveal.beam}`}
// RIGHT:
style={{ backgroundImage: reveal.beam }}
```

Only use Tailwind classes for values known at build time. Use inline `style` for runtime/dynamic colors.
