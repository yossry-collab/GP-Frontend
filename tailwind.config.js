/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-dark': '#0a0a0f',
        'neon-darker': '#060608',
        'neon-card': '#12121a',
        'neon-surface': '#1a1a2e',
        'neon-border': '#2a2a3e',
        'neon-purple': '#a855f7',
        'neon-pink': '#ec4899',
        'neon-blue': '#3b82f6',
        'neon-cyan': '#06b6d4',
        'neon-violet': '#8b5cf6',
        'neon-rose': '#f43f5e',
        'neon-magenta': '#d946ef',
      },
      backdropBlur: {
        'xl': '20px',
        '2xl': '40px',
        '3xl': '60px',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-purple-lg': '0 0 40px rgba(168, 85, 247, 0.4)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
        'glow-pink-lg': '0 0 40px rgba(236, 72, 153, 0.4)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'neon-card': '0 4px 30px rgba(0, 0, 0, 0.3)',
        'neon-hover': '0 8px 40px rgba(168, 85, 247, 0.15)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delay': 'floatDelay 4s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'gradient-x': 'gradientX 3s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'neon-mesh': 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.05) 50%, rgba(6,182,212,0.1) 100%)',
      },
      fontFamily: {
        'sans': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
