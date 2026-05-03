import { Router } from "express";
import * as controller from "./auth.controller.js";
const router: Router = Router();

router.use("/signin", controller.signin);

export default router;
