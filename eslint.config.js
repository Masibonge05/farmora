import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [
      'dist/**',
      'legacy/**',
      'src/legacy/**',
      'src/App.jsx',
      'src/main.jsx',
      'src/components/**',
      'src/pages/**',
      'src/data/**',
      'vite.config.js',
    ],
  },
];

export default eslintConfig;
