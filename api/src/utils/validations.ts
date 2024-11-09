import { Order } from "./types";

export function validateOrder(order: Order) {
  return order.customer_name && order.item && order.quantity > 0;
}
