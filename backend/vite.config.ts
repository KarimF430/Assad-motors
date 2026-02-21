import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Node-compatible __dirname for ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

// We use a dynamic import for the react plugin to avoid having it as a static dependency
// in the production bundle where it's not available.
const getPlugins = async () => {
  if (process.env.NODE_ENV === 'development') {
    const { default: react } = await import("@vitejs/plugin-react");
    return [react()];
  }
  return [];
};

// Production-safe Vite config
export default {
  plugins: await getPlugins(),
  resolve: {
    alias: {
      "@": resolve(__dirname, "client", "src"),
      "@shared": resolve(__dirname, "shared"),
      "@assets": resolve(__dirname, "attached_assets"),
    },
  },
  root: resolve(__dirname, "client"),
  build: {
    outDir: resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
};
