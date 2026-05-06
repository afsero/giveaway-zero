/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070A12",
        panel: "#101622",
        "panel-soft": "#151D2A",
        line: "rgba(148, 163, 184, 0.2)",
        ember: "#F59E0B",
        mint: "#2DD4BF",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(45, 212, 191, 0.12)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
