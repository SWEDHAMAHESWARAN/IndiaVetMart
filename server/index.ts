import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { proxyHandler } from "./routes/proxy";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Proxy route disabled - using Vite proxy instead
  // app.all("/api/proxy/*", proxyHandler);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
