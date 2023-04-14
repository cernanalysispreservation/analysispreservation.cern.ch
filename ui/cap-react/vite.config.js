import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import fs from "fs/promises";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      svgr(),
      visualizer({
        filename: "bundle-stats.html",
      }),
    ],
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
    // ESModules only allow "import" imports. However some libraries (i.e. squirrelly)
    // still use "require" imports. This converts CommonJS modules to ESModules
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
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
    // TEMPORARY: allows using process.env (ideally we should use import.meta.env I think)
    define: {
      "process.env": {},
    },
    // Avoid duplicate dependencies (codemirror was breaking because of this)
    resolve: {
      dedupe: ["@codemirror/state", "@codemirror/view"],
    },
    // Avoid errors when accesing e.g. document from tests
    test: {
      environment: "happy-dom",
    },
  };
});
