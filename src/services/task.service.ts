import { prisma } from "../../prisma/lib/prisma";
import { AppError } from "../error/appError";
import { taskSchema, typeTaskSchema } from "../schemas/task.schema";

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

//make update e delete task
