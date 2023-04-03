import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import fs from "fs/promises";
import theme from "./src/antd/theme";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), svgr()],
    server: {
      // Needed for Docker
      host: true,
      port: 3000,
      // Proxy to backend only on local non-docker development
      //  (for docker dev, nginx takes care of the routing)
      proxy: !env.DOCKER && {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ""),
        },
      },
    },
    // Allows writing JSX in .js files
    esbuild: {
      loader: "jsx",
      include: ["src/**/*.jsx", "src/**/*.js"],
      exclude: [],
    },
    // Same as above
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /src\/.*\.js$/ }, async args => ({
                loader: "jsx",
                contents: await fs.readFile(args.path, "utf8"),
              }));
            },
          },
        ],
      },
    },
    // Adds support for inline JS in antd's less files
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: "@root-entry-name: default;",
          modifyVars: theme,
        },
      },
    },
    // TEMPORARY: allows using process.env (ideally we should use import.meta.env I think)
    define: {
      "process.env": {},
    },
  };
});
