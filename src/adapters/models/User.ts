import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Book } from "./Book";
import { CartItem } from "./CartItem";
import { Order } from "./Order";

export enum Role {
  STUDENT = "buyer",
  ADMIN = "admin"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  semester: number;

  @Column({ type: "enum", enum: Role, default: Role.STUDENT })
  role: Role;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column("decimal", { precision: 2, scale: 1, default: 5.0 })
  rating: number;

  @Column({ default: 0 })
  totalSales: number;

  @CreateDateColumn()
  joinedDate: Date;

  @OneToMany(() => Book, book => book.seller)
  books: Book[];

  @OneToMany(() => CartItem, cartItem => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => Order, order => order.buyer)
  orders: Order[];
}
