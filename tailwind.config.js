const colors = {
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
  },
  // You can remove other color schemes if not needed
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: colors,
      animation: {
        float: "float 30s ease-in-out infinite",
        orbit: "orbit 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translate(0px, 0px) rotate(0deg)",
          },
          "20%": {
            transform: "translate(40px, -40px) rotate(72deg)",
          },
          "40%": {
            transform: "translate(-40px, 40px) rotate(144deg)",
          },
          "60%": {
            transform: "translate(40px, 40px) rotate(216deg)",
          },
          "80%": {
            transform: "translate(-40px, -40px) rotate(288deg)",
          },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg)",
          },
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
      },
    },
  },
  plugins: [],
};
