import { prisma } from "../../prisma/lib/prisma";
import { AppError } from "../error/appError";
import {
  taskSchema,
  typeTaskSchema,
  typeUpdateTaskSchema,
  updateTaskSchema,
} from "../schemas/task.schema";

export const createTask = async (data: typeTaskSchema) => {
  const validation = taskSchema.safeParse(data);

  if (!validation.success) throw new AppError("Dados incorretos", 409);

  const { name, description, activityId } = validation.data;

  const existingId = await prisma.activity.findFirst({
    where: { id: activityId },
  });

  if (!existingId) throw new AppError("Id incorreto", 400);

  const repeatedName = await prisma.task.findFirst({
    where: { name, activityId },
  });

  if (repeatedName) throw new AppError("Dados repetidos", 409);

  const dataToCreate = {
    name: name,
    ...(description !== undefined && { description: description }),
  };

  const [task, updatedActivity] = await prisma.$transaction([
    prisma.task.create({
      data: {
        ...dataToCreate,
        activity: {
          connect: { id: activityId },
        },
      },
    }),
    prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        quantityTasks: { increment: 1 },
      },
    }),
  ]);

  return { task, updatedActivity };
};

export const getTasks = async (activityId: number) => {
  if (!activityId) throw new AppError("Id incorreto", 400);
  const existingId = await prisma.activity.findFirst({
    where: { id: activityId },
  });

  if (!existingId) throw new AppError("Id incorreto", 409);

  const tasks = await prisma.activity.findMany({
    where: {
      id: activityId,
    },

    select: {
      tasks: true,
    },
  });

  return tasks;
};

export const getTaskById = async (taskId: number) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId },
  });
  if (!task) throw new AppError("Id incorreto", 409);

  return task;
};

export const updateTask = async (
  taskId: number,
  data: typeUpdateTaskSchema,
) => {
  const existingId = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
    select: {
      activityId: true,
    },
  });

  if (!existingId) throw new AppError("Id incorreto", 409);

  const validation = updateTaskSchema.safeParse(data);

  if (!validation.success) throw new AppError("Dados inválidos", 409);

  const { name, description, success } = validation.data;

  const { activityId } = existingId;

  if (name) {
    const duplicatedName = await prisma.task.findFirst({
      where: {
        name,
        activityId,
      },
    });

    if (duplicatedName) throw new AppError("Nome duplicado", 409);
  }

  const dataToUpdate = {
    ...(name !== undefined && { name: name }),
    ...(description !== undefined && { description: description }),
    ...(success !== undefined && { success: success }),
  };

  return await prisma.task.update({
    where: { id: taskId },
    data: dataToUpdate,
  });
};

export const deleteTask = async (taskId: number) => {
  const existingId = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
  });

  if (!existingId) throw new AppError("Id incorreto", 409);

  return await prisma.task.delete({
    where: { id: taskId },
  });
};
