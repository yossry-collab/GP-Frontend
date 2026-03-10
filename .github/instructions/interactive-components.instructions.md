---
description: "Use when building forms, inputs, modals, toast notifications, or any interactive UI component. Covers form layout, validation display, input styling, and notification patterns."
---

# Interactive Component Patterns

## Form Inputs

```tsx
<input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition" />
```

## Toast / Flash Messages

Use inline animated banners, not external toast libraries:

```tsx
<AnimatePresence>
  {msg && (
    <motion.div
      className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
        msg.type === "success"
          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      {msg.type === "success" ? <Check /> : <AlertCircle />} {msg.text}
    </motion.div>
  )}
</AnimatePresence>
```

Auto-dismiss with `setTimeout(() => setMsg(null), 4000)`.

## Loading Spinners

```tsx
<div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
```

Center with `flex justify-center py-20`.

## Badge / Tag Styling

- Tier badge: `px-3 py-1.5 rounded-xl text-sm font-semibold` + tierConfig colors
- Rarity tag: `px-3 py-1 rounded-full text-xs font-bold uppercase`
- Status label: `text-[10px] font-bold uppercase` in a small rounded container

## Empty States

```tsx
<div className="text-center py-20 text-gray-400">
  <IconComponent className="w-12 h-12 mx-auto mb-3 opacity-40" />
  <p>No items available yet. Check back soon!</p>
</div>
```
