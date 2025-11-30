/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root',
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Add custom colors for dark theme
        dark: {
          bg: '#242424',
          surface: '#1a1a1a',
          text: 'rgba(255, 255, 255, 0.87)',
          'text-secondary': '#888',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      maxWidth: {
        'container': '1280px',
      }
    },
  },
  corePlugins: {
    preflight: true, // Enable Tailwind's CSS reset
  },
  plugins: [],
}
