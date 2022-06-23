import commonjs from 'rollup-plugin-commonjs';
import react from 'react';
import reactDom from 'react-dom';
import dts from "rollup-plugin-dts";

export default [
  {
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
  },
  {
    input: './out-tsc/src/index.d.ts',
    output: {
      file: 'dist/index.d.ts'
    },
    plugins: [dts()]
  }
];