/** @type {import('tailwindcss').Config} */
// In Tailwind v4, design tokens are defined in @theme inside index.css.
// This file only needs to specify which files Tailwind should scan for classes.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
};