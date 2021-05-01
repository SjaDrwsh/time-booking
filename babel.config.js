'use strict';

const browserTargets = [
  'last 2 Chrome versions',
  'last 2 Firefox versions',
  'last 2 Safari versions',
  'last 2 Edge versions',
  'last 2 Opera versions',
  'IE >= 11',
  'not dead', // Exclude browsers with less than 0.5% global usage and without official support or updates for 24 months.
];


const devPlugins = ['@babel/plugin-syntax-jsx'];

// Running in reversed order - last array entry runs first
const presets = [
  [
    '@babel/preset-env',
    { useBuiltIns: 'entry', corejs: 3, modules: 'commonjs', targets: browserTargets },
  ],
  '@babel/preset-react',
  '@babel/preset-typescript',
  
];

module.exports = {
  plugins: devPlugins,
  presets,
};
