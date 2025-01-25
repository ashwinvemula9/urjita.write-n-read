const defaultTheme = require("tailwindcss/defaultTheme");

const colors = {
  // Brand colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
  // Neutral colors
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  // Accent colors
  accent: {
    blue: {
      light: "#60a5fa",
      DEFAULT: "#3b82f6",
      dark: "#2563eb",
    },
    pink: {
      light: "#f472b6",
      DEFAULT: "#ec4899",
      dark: "#db2777",
    },
    purple: {
      light: "#a78bfa",
      DEFAULT: "#8b5cf6",
      dark: "#7c3aed",
    },
  },
  // Status colors
  status: {
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        display: ["Space Grotesk", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        float: "float 25s ease-in-out infinite",
        pulse: "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(20px)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        glow: "0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(59, 130, 246, 0.6)",
        "inner-glow": "inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)",
        bottom: "0px 2px 7px #2c3b63"
      },
    },
  },
  plugins: [],
};
