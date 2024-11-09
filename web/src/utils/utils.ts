import { Order } from "./types";

export function generateDateTemplate(incDate: any) {
  let date = new Date(incDate);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  const hour = date.getHours().toString();
  const minutes = date.getMinutes().toString();

  return `${day} / ${month} / ${year} at ${
    hour.length < 2 ? "0" + hour : hour
  }:${minutes.length < 2 ? "0" + minutes : minutes}${
    +hour >= 12 && +hour < 24 ? " pm" : " am"
  }`;
}

export function validateOrder(order: Order) {
  const error_msgs = {
    customer_name: [] as string[],
    item: [] as string[],
    quantity: [] as string[],
  };
  if (!validateName(order.customer_name)) {
    if (order.customer_name.length < 4 || order.customer_name.length > 20)
      error_msgs.customer_name.push(
        "Customer's name needs between 4 and 20 letters"
      );

    if (!checkLetters(order.customer_name))
      error_msgs.customer_name.push(
        "Customer's name can't have numbers or symbols"
      );
    if (!order.customer_name)
      error_msgs.customer_name.push("Customer's name can't be empty!");
  }
  if (!validateItem(order.item)) {
    if (order.item.length < 3 || order.item.length > 35)
      error_msgs.item.push("Item needs between 3 and 35 characters");
    if (!checkAlphanumericWithSpaces(order.item))
      error_msgs.item.push("Item use alphanumeric characters and spaces only");
    if (!order.item) {
      error_msgs.item.push("Item can't be empty");
    }
  }
  if (order.quantity < 1 || order.quantity > 100)
    error_msgs.quantity.push("Quantity has to be between 1 and 100");
  return { passed: validateAll(order), msgs: error_msgs };
}

function validateAll(order: Order) {
  return {
    customer_name: validateName(order.customer_name),
    item: validateItem(order.item),
    quantity: order.quantity >= 1 && order.quantity <= 100,
  };
}

function validateName(name: string) {
  return name && checkLetters(name) && name.length >= 4 && name.length <= 20;
}

function validateItem(item: string) {
  return (
    item &&
    checkAlphanumericWithSpaces(item) &&
    item.length >= 3 &&
    item.length <= 35
  );
}

function checkLetters(str: string) {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(str);
}

function checkAlphanumericWithSpaces(str: string) {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(str);
}
