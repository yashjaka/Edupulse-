import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import edupulseRouter from "./edupulse.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(edupulseRouter);

export default router;
