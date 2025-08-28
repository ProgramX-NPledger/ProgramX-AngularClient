// TypeScript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: { extend: {} },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
        'light',
      'dark',
      'cupcake',
      'corporate',
      'emerald',
      'dracula',
      'night',
      'winter',
    ]
  },
};
