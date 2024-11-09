const express = require("express");
import "reflect-metadata";
import { AppDataSource } from "./utils/data-source";

import { Request, Response } from "express";
import { orderServ } from "./services/order.service";
import { Order, Status } from "./utils/types";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

AppDataSource.initialize().then(() => {
  console.log("Connected to SQLite database.");
});

app.get("/orders", async (req: Request, res: Response) => {
  try {
    const page = req.query.page as unknown as number;
    const pageSize = req.query.pageSize as unknown as number;
    const orders = (await orderServ.getAllOrders(page, pageSize)) as Order[];
    return res.status(200).json(orders);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

app.get("/orders/count", async (req: Request, res: Response) => {
  try {
    const byStatus = req.query.status as unknown as Status;
    let totalOrders = 0;
    if (byStatus) totalOrders = await orderServ.countOrdersByStatus(byStatus);
    else totalOrders = await orderServ.countOrders();
    return res.status(200).json({ total: totalOrders });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

app.get("/orders/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as string;
    const order = await orderServ.getOrderById(id);
    return res.status(200).json(order);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

app.get("/ordersByStatus", async (req: Request, res: Response) => {
  try {
    const status = req.query.status as unknown as Status;
    const page = req.query.page as unknown as number;
    const pageSize = req.query.pageSize as unknown as number;
    const orders = await orderServ.getOrdersByStatus(status, page, pageSize);
    return res.status(200).json(orders);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

app.post("/orders", async (req: Request, res: Response) => {
  try {
    const order = req.body as unknown as Order;
    const newOrder = await orderServ.saveOrder(order);
    return res.status(200).json(newOrder);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

app.put("/orders/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as string;
    const newOrder = req.body as unknown as Order;
    const updatedOrder = await orderServ.updateOrder(id, newOrder);
    return res.status(200).json(updatedOrder);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

app.del("/orders/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as string;
    const response = await orderServ.deleteOrderById(id);
    return res.status(200).json(response);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

module.exports = app;
