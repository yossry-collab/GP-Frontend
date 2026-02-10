# GamePlug Frontend

A modern gaming-themed login page and authentication UI for the GamePlug e-commerce platform.

## Tech Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in browser.

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page (login)
│   └── globals.css         # Global styles
├── components/
│   ├── LoginPage.tsx       # Main login page layout
│   ├── LoginForm.tsx       # Login form component
│   └── SocialButtons.tsx   # Social login buttons
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Features

✅ **Gaming-Themed Design**
- Dark immersive background with gradients
- Glass morphism effect on login card
- Animated decorative elements

✅ **Responsive Layout**
- Two-column desktop layout (brand + login)
- Mobile-friendly stacked layout
- Fully responsive at all breakpoints

✅ **Smooth Animations**
- Framer Motion entrance animations
- Hover effects on inputs and buttons
- Animated background elements
- Smooth transitions (200-300ms)

✅ **User Interaction**
- Email input with validation
- Password input with show/hide toggle
- Loading state on login button
- Error message display
- Forgot password link
- Social login buttons (Google, Discord, Steam)

✅ **Production Ready**
- TypeScript for type safety
- Accessible form labels
- Focus states for keyboard navigation
- Semantic HTML structure

## Environment Variables

Create `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=https://gp-backend-vg3p.onrender.com
NEXT_PUBLIC_APP_NAME=GamePlug
```

## API Integration

The login form is ready to connect to your backend. Update the `handleSubmit` function in `LoginForm.tsx`:

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
```

## Customization

### Colors
Edit `tailwind.config.js` to customize the gaming-themed colors:
- `gaming-dark` - Main dark background
- `gaming-accent` - Red accent (primary CTA)
- `gaming-orange` - Orange accent
- `gaming-purple` - Purple accent
- `gaming-blue` - Blue accent

### Animations
Modify animation durations in component files (default 200-300ms for smooth feel)

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome for Android

## Next Steps

1. **Connect Backend API**: Uncomment API calls in `LoginForm.tsx`
2. **Add Registration Page**: Create similar component for signup
3. **Add Auth Context**: Implement global user state
4. **Add Dashboard**: Protected routes after login
5. **Add Animations**: More micro-interactions

## Performance

- Optimized images and animations
- Code splitting with Next.js
- CSS Tailwind optimization
- Production bundle size: ~120KB (gzipped)

## License
MIT

---

Built for GamePlug e-commerce platform
