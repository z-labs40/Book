import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";
import { OrderItem } from "./OrderItem";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal")
  totalAmount: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn()
  orderDate: Date;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: "buyerId" })
  buyer: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "sellerId" })
  seller: User;

  @ManyToOne(() => Book, { nullable: true })
  @JoinColumn({ name: "bookId" })
  book: Book;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];
}
