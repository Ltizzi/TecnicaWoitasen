import { DataSource } from "typeorm";
import { OrderEntity } from "../entity/order.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [OrderEntity],
  migrations: [],
  subscribers: [],
});
