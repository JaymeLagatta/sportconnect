module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: { 500: '#6D28D9', 600: '#5B21B6' },
        secondary: { 500: '#10B981', 600: '#059669' },
        silver: { 100: '#F3F4F6', 500: '#9CA3AF', 800: '#1F2937' }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}