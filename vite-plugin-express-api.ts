import type { IncomingMessage, ServerResponse } from "http";
import type { Plugin } from "vite";
import { createServer } from "./server/index";

/**
 * Runs the Express app inside Vite dev so `/api/*` works on the same port as the SPA.
 */
export function expressApiPlugin(): Plugin {
  return {
    name: "express-api",
    configureServer(viteServer) {
      const app = createServer();
      viteServer.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const pathOnly = (req.url ?? "").split("?")[0] ?? "";
        if (!pathOnly.startsWith("/api")) {
          next();
          return;
        }
        // Express Application is compatible with Node's req/res at runtime (Connect-style stack).
        (app as (req: IncomingMessage, res: ServerResponse, next: () => void) => void)(req, res, next);
      });
    },
  };
}
