import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";
import { Book } from "./Book";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal")
  priceAtTime: number;

  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: "orderId" })
  order: Order;

  @ManyToOne(() => Book, book => book.orderItems)
  @JoinColumn({ name: "bookId" })
  book: Book;
}
