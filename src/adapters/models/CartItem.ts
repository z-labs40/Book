import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => User, user => user.cartItems)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Book, book => book.cartItems)
  @JoinColumn({ name: "bookId" })
  book: Book;
}
