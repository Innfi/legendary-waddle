/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root',
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // Disable to avoid conflicts with MUI's baseline
  },
  plugins: [],
}
