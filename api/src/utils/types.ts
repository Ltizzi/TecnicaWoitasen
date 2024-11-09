import { Request, Response } from "express";

export enum Status {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Order {
  id: string;
  customer_name: string;
  item: string;
  quantity: number;
  status: Status;
  created_at: Date;
}
