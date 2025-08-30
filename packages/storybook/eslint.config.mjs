import baseReactConfig from "@heroui/standard/eslint/react.mjs";
import {defineConfig} from "eslint/config";

const config = defineConfig([
  ...baseReactConfig,
  {
    ignores: ["storybook-static/**", "storybook-static", ".storybook/**", ".storybook"],
  },
]);

export default config;
