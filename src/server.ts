import express from "express";
import { prisma } from "../prisma/lib/prisma";

const app = express();

app.get("/", (req, res) => {
  res.send("aoba");
});

app.listen(3000, async () => {
  await prisma.activity.create({
    data: {
      name: "teste",
      quantityTasks: 0,
    },
  });
  console.log("Servidor sojsosj");
});
