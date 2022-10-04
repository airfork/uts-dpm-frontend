/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["src/**/*.{html,ts}"],
  theme: {
    extend: {}
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#232D4B",
          "primary-content": "#FFFFFF",
          "secondary": "#E57200",
          "secondary-content": "#232D4B",
          "accent": "#EB5F0C",
          "neutral": "#392C3A",
          "base-100": "#FFFFFF",
          "base-content": "#666666",
          "info": "#009FDF",
          "success": "#62BB46",
          "warning": "#F3BD49",
          "error": "#DF1E43"
        },
        dark: {
          "primary": "#E57200",
          "primary-content": "#232D4B",
          "secondary": "#232D4B",
          "secondary-content": "#FFFFFF",
          "accent": "#EB5F0C",
          "accent-content": "#FFFFFF",
          "base-100": "#1f2937",
          "info": "#009FDF",
          "success": "#62BB46",
          "warning": "#F3BD49",
          "error": "#E21D3B"
        }
      }]
  }
};
