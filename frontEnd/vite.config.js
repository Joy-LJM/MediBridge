import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // test: {
  //   globals: true, // Enable global test functions like `expect`, `it`, `describe`
  //   environment: "jsdom", // Use jsdom for simulating the browser environment
  //   setupFiles: ["./src/setupTests.js"], // Add jest-dom matchers
  // },
});
