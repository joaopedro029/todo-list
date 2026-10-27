import { Router } from "express";
import { router as activityRoutes } from "./activity";
import { router as taskRoutes } from "./task";

export const router = Router();

router.use("/activity", activityRoutes);
router.use("/task", taskRoutes);
