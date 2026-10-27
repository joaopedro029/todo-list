import type { Request, Response } from "express";
import { AppError } from "../error/appError";
import {
  createActivity,
  deleteActivity,
  getAllActivities,
  updateActivity,
} from "../services/activity.service";

export const create = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const activity = await createActivity(data);

    return res
      .status(201)
      .json({ message: "Atividade criada com sucesso", data: activity });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const activities = await getAllActivities();

    return res.status(200).json({ data: activities });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const idActivity = Number(req.params.id);
    const updatedActivity = await updateActivity(data, idActivity);
    return res.status(201).json({
      message: "Atividade editada com sucesso",
      dataUpdated: updatedActivity,
    });
  } catch (error) {
    if (error instanceof AppError)
      return res.status(error.statusCode).json({ message: error.message });

    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const activityDeleted = await deleteActivity(id);
    return res
      .status(200)
      .json({
        message: "Atividade deletada com sucesso",
        data: activityDeleted,
      });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError)
      return res.status(error.statusCode).json({ message: error.message });

    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
