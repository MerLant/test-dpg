import js from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid/configs/recommended";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{ts,tsx}"],
		plugins: { js },
		extends: ["js/recommended"],
	},
	{
		files: ["**/*.{ts,tsx}"],
	},
	tseslint.configs.recommended,
	solid,
]);
