import { Router } from "express";
import {
  create,
  getAll,
  remove,
  update,
} from "../../controller/activity.controller";

export const router = Router();

router.get("/get-all", getAll);
router.post("/create", create);
router.put("/update/:id", update);
router.delete("/delete/:id", remove);
