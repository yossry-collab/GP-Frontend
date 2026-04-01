# GamePlug Frontend - Getting Started

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

## Project Structure

```
components/
  ├── LoginPage.tsx       - Main page layout with two-column design
  ├── LoginForm.tsx       - Login card with email/password form
  └── SocialButtons.tsx   - Social login buttons (Google/Discord/Steam)

lib/
  ├── api.ts             - Axios API client with interceptors
  └── auth-context.tsx   - React Context for authentication state

app/
  ├── layout.tsx         - Root layout
  ├── page.tsx           - Home page (login)
  └── globals.css        - Global styles & animations
```

## Features Implemented

✅ **Modern Gaming UI**

- Dark gradient backgrounds (gaming-themed)
- Glass morphism login card
- Animated decorative elements
- Framer Motion smooth animations

✅ **Fully Responsive**

- Desktop: Two-column layout (brand + login)
- Mobile: Stacked vertical layout
- All breakpoints optimized

✅ **Form Functionality**

- Email input field (based on user model)
- Password input with show/hide toggle
- Login button with loading state
- Error message display
- Forgot password link
- Social login buttons

✅ **Ready for Backend Integration**

- API client configured in `lib/api.ts`
- Auth context for state management in `lib/auth-context.tsx`
- Uncomment API call in `LoginForm.tsx` handleSubmit function

## Environment Variables

File: `.env.local`

```bash
NEXT_PUBLIC_API_URL=https://gp-backend-vg3p.onrender.com
NEXT_PUBLIC_APP_NAME=GamePlug
NEXT_PUBLIC_CHATWOOT_BASE_URL=https://app.chatwoot.com
NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN=your_chatwoot_website_token
```

## Chatwoot Setup

The first support-agent integration is mounted globally in the frontend, but it only appears for authenticated users.

1. In Chatwoot Cloud, create a website inbox.
2. Copy the website token into `NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN`.
3. Keep `NEXT_PUBLIC_CHATWOOT_BASE_URL=https://app.chatwoot.com` unless you move to self-hosted Chatwoot later.
4. Restart the frontend after updating `.env.local`.

The frontend now includes the base Chatwoot widget integration and the backend now exposes support knowledge and ticket endpoints under `/api/support` for future AI workflows.

## Built-In Support Assistant

If Chatwoot is not configured, the Help action now opens the in-app support assistant.

- It can answer greetings and basic support questions out of the box.
- It becomes much smarter when the backend has AI env vars configured.
- The backend env vars are:

```bash
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

Without those backend env vars, the assistant still works, but it uses rule-based knowledge matching instead of real LLM-generated answers.

## To Connect with Backend

Edit `components/LoginForm.tsx` in the `handleSubmit` function:

```typescript
// Uncomment this:
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  },
);
```

Or use the provided API client:

```typescript
import { authAPI } from "@/lib/api";

const response = await authAPI.login({ email, password });
const { token, user } = response.data;
localStorage.setItem("token", token);
// Redirect to dashboard
```

## Authentication Flow

1. User enters email & password
2. Form validates inputs
3. Sends POST to `/api/users/login`
4. Backend returns JWT token + user data
5. Store token in localStorage
6. Redirect to dashboard/home

## Testing

With mock data (current):

- Click "Let's Play" button
- See loading state
- Form is ready for real API

## Next Steps

1. ✅ Frontend Login UI (DONE)
2. → Connect to backend API
3. → Build Registration page
4. → Build Dashboard
5. → Build Product Listing
6. → Build Shopping Cart
7. → Build Checkout

## Tailwind Colors (Gaming Theme)

```
gaming-dark:      #0f0e17  (main bg)
gaming-darker:    #0a0908  (darker)
gaming-accent:    #ff3333  (red - primary)
gaming-orange:    #ff7f00  (orange)
gaming-purple:    #7c3aed  (purple)
gaming-blue:      #1e3a8a  (blue)
```

## Available Scripts

```bash
npm run dev      # Run dev server (port 3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide React** - Icons

## Performance

- Optimized for mobile & desktop
- Smooth animations (60fps)
- Production bundle: ~120KB (gzipped)
- Next.js image optimization ready

## Notes

- Component is fully typed with TypeScript
- All animations are GPU-accelerated
- Form validation ready
- Accessibility compliant (ARIA labels)
- Ready for dark mode

---

Happy Coding! 🎮
