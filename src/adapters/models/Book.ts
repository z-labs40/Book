import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { User } from "./User";
import { CartItem } from "./CartItem";
import { OrderItem } from "./OrderItem";

export enum Condition {
  NEW = "new",
  GOOD = "good",
  OLD = "old"
}

export enum Status {
  ACTIVE = "active",
  SOLD = "sold",
  PENDING = "pending_approval",
  REJECTED = "rejected"
}

@Entity()
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  department: string;

  @Column()
  semester: number;

  @Column()
  subject: string;

  @Column({ type: "enum", enum: Condition })
  condition: Condition;

  @Column("decimal")
  price: number;

  @Column("decimal", { nullable: true })
  originalPrice: number;

  @Column("text")
  description: string;

  @Column("simple-array")
  tags: string[];

  @Column()
  meetupLocation: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: "enum", enum: Status, default: Status.PENDING })
  status: Status;

  @Column({ default: true })
  available: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  viewsCount: number;

  @ManyToOne(() => User, user => user.books)
  @JoinColumn({ name: "sellerId" })
  seller: User;

  @ManyToMany(() => User)
  @JoinTable({ name: "wishlists" })
  wishlistedBy: User[];

  @OneToMany(() => CartItem, cartItem => cartItem.book)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, orderItem => orderItem.book)
  orderItems: OrderItem[];
}
