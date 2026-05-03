import express from "express";
import path from "node:path";
// import checkBoxRoutes from "./modules/checkbox/checkbox.route.js";
import type { Application } from "express";
import authRoutes from "./modules/auth/auth.route.js"
export function createServerApplication(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.resolve("./public")));

  app.use('/api/auth',authRoutes)


  return app;
}
