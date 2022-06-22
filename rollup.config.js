import { createBasicConfig } from '@open-wc/building-rollup';
import commonjs from 'rollup-plugin-commonjs';
import react from 'react';
import reactDom from 'react-dom';

const baseConfig = createBasicConfig();

export default {
  input: './out-tsc/src/index.js',
  output: {
    fileName: "index.js",
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        react: Object.keys(react),
        'react-dom': Object.keys(reactDom)
      }
    })
  ],
};