---
description: "Use when building, editing, or reviewing React components, pages, layouts, or any frontend UI. Covers the GamePlug design system: colors, dark mode, spacing, cards, buttons, and component structure."
applyTo: "{app,components,lib}/**/*.{tsx,ts,css}"
---

# GamePlug UI Design System

## Color Palette

- **Primary**: purple gradient `primary-500` (#8b5cf6) through `primary-700` (#7c3aed)
- **Accent**: pink `accent-500` (#ec4899)
- **Amber/Gold**: used for points, coins, and loyalty badges
- **Cyan/Indigo**: used for platinum-tier elements
- Use Tailwind's custom `primary-*` and `accent-*` scales defined in `tailwind.config.js`

## Dark Mode

- Always implement both light and dark variants using `dark:` prefix
- Card backgrounds: `bg-white dark:bg-[#16161f]`
- Page backgrounds: `bg-gray-50 dark:bg-[#0a0a12]`
- Borders on dark cards: `dark:border dark:border-white/[0.06]`
- Shadows disappear in dark: `dark:shadow-none`
- Text: `text-gray-900 dark:text-white` for headings, `text-gray-500` for secondary

## Cards

Use the established Card pattern with Framer Motion entry animation:

```tsx
<motion.div
  className="bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06]"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.08, duration: 0.4 }}
>
```

- Rounded corners: `rounded-2xl` for cards, `rounded-xl` for buttons/inputs
- Inner padding: `p-5` or `p-6`

## Buttons

- Primary CTA: `bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl px-5 py-2.5 font-bold text-sm`
- Hover: `hover:shadow-lg hover:shadow-primary-500/25`
- Secondary: `bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl`
- Disabled: `bg-gray-100 dark:bg-white/[0.04] text-gray-400 cursor-not-allowed`

## Typography

- Page titles: `text-2xl font-bold`
- Card headings: `text-lg font-bold` or `font-extrabold`
- Labels/metadata: `text-xs font-medium text-gray-500` or `text-[11px] uppercase tracking-[0.22em]`
- Use `font-mono` only for codes/IDs

## Opacity Values

- Use bracket notation for arbitrary values: `bg-white/[0.06]`, `bg-white/[0.08]`
- Standard Tailwind scale for common ones: `bg-black/20`, `text-white/70`

## Layout

- Max width containers: `max-w-6xl mx-auto px-4 sm:px-6`
- Grid patterns: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Use responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`

## Icons

- Use `@phosphor-icons/react` for all icons
- Standard sizes: `w-4 h-4` (inline), `w-5 h-5` (badges), `w-7 h-7` (feature icons)
- Icon containers: colored rounded div like `w-10 h-10 rounded-xl bg-gradient-to-br from-X to-Y flex items-center justify-center text-white`

## Component Rules

- All pages are `"use client"` where state/auth is needed
- Wrap authenticated pages in `<ProtectedRoute>` with `<Navbar />` above content
- Use `useAuth()` from `@/lib/auth-context` for auth state
- Use `@/lib/api` for all API calls (never raw fetch)
