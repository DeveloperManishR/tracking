import express from "express";
import path from "node:path";
// import checkBoxRoutes from "./modules/checkbox/checkbox.route.js";
import type { Application } from "express";
import { publicEnv } from "../db/env.js";
import authRoutes from "./modules/auth/auth.route.js";

export function createServerApplication(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_request, response) => {
    response.json({ ok: true });
  });

  app.get("/api/public-env", (_request, response) => {
    response.json(publicEnv);
  });

  app.get("/login.html", (_request, response) => {
    response.sendFile(path.resolve("./public/Login.html"));
  });

  app.use(express.static(path.resolve("./public")));

  app.use("/api/auth", authRoutes);


  return app;
}
