import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { Order, Status } from "../utils/types";

@Entity("orders")
export class OrderEntity implements Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  customer_name!: string;

  @Column()
  item!: string;

  @Column()
  quantity!: number;

  @Column()
  status!: Status;

  //como estoy usando SQLite, no es compatible con el tipo 'timestamp' así q estoy usando 'datetime' en su lugar
  @CreateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;
}
