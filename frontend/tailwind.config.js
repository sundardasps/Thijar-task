// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",

      // ➜ Default Tailwind palette (must include it manually in v4)
      white: "#ffffff",
      black: "#000000",
      gray: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
      },


      lightblue: "#cdf6fa",
    },

    borderWidth: {
      DEFAULT: "1px",
    },
    borderColor: {
      DEFAULT: "#d1d5db",
    },
    borderRadius: {
      DEFAULT: "0.375rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
    },
  },
};
