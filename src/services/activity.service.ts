import { includes, safeParse } from "zod";
import { activitySchema, dataCreateActivity } from "../schemas/activity.schema";
import { AppError } from "../error/appError";
import { prisma } from "../../prisma/lib/prisma";

export const createActivity = async (data: dataCreateActivity) => {
  const validation = activitySchema.safeParse(data);

  if (!validation.success) throw new AppError("Dados inválidos", 400);

  const { name } = validation.data;

  const duplicatedActivity = await prisma.activity.findFirst({
    where: {
      name,
    },
  });

  if (duplicatedActivity) throw new AppError("Nome duplicado", 409);

  const activity = await prisma.activity.create({
    data: {
      name,
      quantityTasks: 0,
    },
  });

  return activity;
};

export const getAllActivities = async () => {
  const activities = await prisma.activity.findMany({
    include: { tasks: true },
  });

  if (activities.length < 1)
    throw new AppError("Nenhuma atividade criada", 404);

  return activities;
};

export const updateActivity = async (data: dataCreateActivity, id: number) => {
  const existingActivity = await prisma.activity.findFirst({ where: { id } });

  if (!existingActivity) throw new AppError("Id incorreto", 404);

  const validation = activitySchema.safeParse(data);

  if (!validation.success) throw new AppError("Dados inválidos", 400);

  const { name } = validation.data;

  const duplicatedActivity = await prisma.activity.findFirst({
    where: {
      name,
    },
  });

  if (duplicatedActivity) throw new AppError("Nome duplicado", 409);

  const activity = await prisma.activity.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return activity;
};

export const deleteActivity = async (id: number) => {
  const existingActivity = await prisma.activity.findFirst({ where: { id } });

  if (!existingActivity) throw new AppError("Id incorreto", 404);

  return await prisma.activity.delete({
    where: { id },
  });
};
