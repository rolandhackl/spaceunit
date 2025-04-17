
import terser from "@rollup/plugin-terser";

export default {
  input: "src/spaceunit-card.js",
  output: {
    file: "dist/spaceunit-card.js",
    format: "esm"
  },
  treeshake: false,
  plugins: [terser({ keep_classnames: true })]
};
