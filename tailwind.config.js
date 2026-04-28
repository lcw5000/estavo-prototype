/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:    '#1F2E4A',
        rust:    '#C84B2F',
        teal:    '#1A5C4A',
        gold:    '#C49A3C',
        slate:   '#4A5568',
        ink3:    '#8A8A8A',
        paper:   '#FAF9F6',
        card:    '#FFFFFF',
        rule:    '#E8E4DC',
        'ui-bg': '#F2F0EC',
        sidebar: '#1D2535',
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        // Estavo type scale
        'label':  ['12px', { lineHeight: '16px', letterSpacing: '0.03em' }],
        'sub':    ['16px', { lineHeight: '22px' }],
        'card':   ['16px', { lineHeight: '22px' }],
        'page':   ['20px', { lineHeight: '28px' }],
        'section':['28px', { lineHeight: '36px' }],
        'hero':   ['36px', { lineHeight: '44px' }],
      },
      spacing: {
        'sidebar':    '200px',
        'sidebar-sm': '44px',
        'topbar':     '64px',
      },
      width: {
        'sidebar':    '200px',
        'sidebar-sm': '44px',
      },
      height: {
        'topbar': '64px',
      },
    },
  },
  plugins: [],
}
