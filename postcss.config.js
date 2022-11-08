const { join } = require('path');
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
    tailwindcss: {},
    autoprefixer: {},
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.js'),
    },
  },
};
