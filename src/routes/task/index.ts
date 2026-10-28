import { Router } from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../../controller/task.controller";

export const router = Router();

router.post("/create", create);
router.get("/get-all", getAll);
router.get("/get-by-id/:id", getById);
router.put("/update/:id", update);
router.delete("/delete/:id", remove);
