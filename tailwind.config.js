/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: {
            light: '#AFA9EC',
            DEFAULT: '#7F77DD',
            dark: '#534AB7',
          },
          pink: {
            light: '#F0997B',
            DEFAULT: '#D4537E',
            dark: '#993556',
          },
          amber: {
            DEFAULT: '#EF9F27',
            dark: '#BA7517',
          },
        },
        success: '#639922',
        warning: '#BA7517',
        danger: '#E24B4A',
        info: '#378ADD',
      },
      fontFamily: {
        sans: ['Poppins', 'Cairo', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        card: '16px',
        pill: '9999px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7F77DD, #D4537E)',
      },
      boxShadow: {
        card: '0 8px 20px -6px rgba(127, 119, 221, 0.25)',
      },
    },
  },
  plugins: [],
}