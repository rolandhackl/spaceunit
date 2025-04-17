import terser from "@rollup/plugin-terser";

export default {
  input: "src/spaceunit.js",
  output: {
    file: "dist/spaceunit.js",
    format: "esm"
  },
  treeshake: false,
  plugins: [terser()]
};