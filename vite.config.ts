import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    open: true,
    host: true,
    https: {
      cert: "C:\\Users\\ameil\\OneDrive\\Documents\\Github Repositories\\certificates\\172.20.112.1.pem",
      key: "C:\\Users\\ameil\\OneDrive\\Documents\\Github Repositories\\certificates\\172.20.112.1-key.pem",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
