import type { Request, Response } from "express";
import { AppError } from "../error/appError";
import { createTask, getTaskById, getTasks } from "../services/task.service";

export const create = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { task, updatedActivity } = await createTask(data);

    return res.status(201).json({
      message: "Tarefa criada com sucesso",
      data: { task: task, updatedActivity: updatedActivity },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError)
      return res.status(error.statusCode).json({ message: error.message });

    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    console.log("oiii");
    const activityId = req.body.activityId;
    console.log("oiiii");
    console.log(activityId);

    const tasks = await getTasks(activityId);

    return res.status(200).json({ data: tasks });
  } catch (error) {
    if (error instanceof AppError)
      return res.status(error.statusCode).json({ message: error.message });

    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id);

    const task = await getTaskById(taskId);

    return res.status(200).json({ data: task });
  } catch (error) {
    if (error instanceof AppError)
      return res.status(error.statusCode).json({ message: error.message });

    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
