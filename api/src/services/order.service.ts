import { OrderEntity } from "../entity/order.entity";
import { AppDataSource } from "../utils/data-source";
import { Order, Status } from "../utils/types";
import { validateOrder } from "../utils/validations";

const orderRepo = AppDataSource.getRepository(OrderEntity);

async function saveOrder(order: Order): Promise<OrderEntity | Error> {
  if (validateOrder(order)) {
    return await orderRepo.save(order);
  } else return new Error("Order  not valid");
}

async function updateOrder(
  id: string,
  order: Order
): Promise<OrderEntity | Error> {
  const oldOrder = await getOrderById(id);
  if (oldOrder) {
    order.id = oldOrder.id;
    order.created_at = oldOrder.created_at;
    orderRepo.merge(oldOrder, order);
    return await orderRepo.save(order);
  } else return new Error("Order not found!");
}

async function getOrderById(id: string): Promise<OrderEntity | null> {
  return await orderRepo.findOneBy({ id: id });
}

async function deleteOrderById(id: string): Promise<Object> {
  const order = await getOrderById(id);
  if (order) {
    const deleteResult = await orderRepo.delete({ id: id });
    if (deleteResult.affected && deleteResult.affected > 0)
      return { status: "OK" };
    else return new Error("Something went wrong / Can't delete order");
  } else return new Error("Order not found!");
}

async function getAllOrders(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  return await orderRepo.find({
    order: { created_at: "ASC" },
    skip: skip,
    take: pageSize,
  });
}

async function getOrdersByStatus(
  status: Status,
  page: number,
  pageSize: number
) {
  const skip = (page - 1) * pageSize;
  return await orderRepo.find({
    order: { created_at: "ASC" },
    skip: skip,
    take: pageSize,
    where: { status },
  });
}

async function countOrders() {
  return await orderRepo.count();
}

async function countOrdersByStatus(status: Status) {
  return await orderRepo.count({ where: { status: status } });
}

export const orderServ = {
  saveOrder,
  getOrderById,
  deleteOrderById,
  getAllOrders,
  getOrdersByStatus,
  updateOrder,
  countOrders,
  countOrdersByStatus,
};
