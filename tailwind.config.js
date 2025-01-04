const colors = {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  accent: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  bubble: {
    pink: '#f43f5e', 
    blue: '#3b82f6',
  }
};

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: colors,
      animation: {
        float: 'float 30s ease-in-out infinite',
        orbit: 'orbit 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translate(0px, 0px) rotate(0deg)',
          },
          '20%': {
            transform: 'translate(40px, -40px) rotate(72deg)',
          },
          '40%': {
            transform: 'translate(-40px, 40px) rotate(144deg)',
          },
          '60%': {
            transform: 'translate(40px, 40px) rotate(216deg)',
          },
          '80%': {
            transform: 'translate(-40px, -40px) rotate(288deg)',
          },
        },
        orbit: {
          '0%': {
            transform: 'rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg)',
          },
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        glow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(139, 92, 246, 0.6)',
      },
    },
  },
  plugins: [],
};
