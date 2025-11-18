/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f3fdfb',
        card: '#ffffff',
        primary: '#2aa6a0',
        'primary-dark': '#20867f',
        accent: '#0b6b6a',
        muted: '#6b7b7a',
      },
      borderRadius: {
        xl: '18px',
        lg: '14px',
      },
      boxShadow: {
        card: '0 8px 28px rgba(12, 40, 36, 0.08)',
        mockup: '0 6px 22px rgba(18, 70, 68, 0.06)',
      },
      maxWidth: {
        container: '1150px',
      },
      fontFamily: {
         sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
