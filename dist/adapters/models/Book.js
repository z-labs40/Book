"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = exports.Status = exports.Condition = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const CartItem_1 = require("./CartItem");
const OrderItem_1 = require("./OrderItem");
var Condition;
(function (Condition) {
    Condition["NEW"] = "new";
    Condition["GOOD"] = "good";
    Condition["OLD"] = "old";
})(Condition || (exports.Condition = Condition = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "active";
    Status["SOLD"] = "sold";
    Status["PENDING"] = "pending_approval";
    Status["REJECTED"] = "rejected";
})(Status || (exports.Status = Status = {}));
let Book = class Book {
    id;
    title;
    author;
    department;
    semester;
    subject;
    condition;
    price;
    originalPrice;
    description;
    tags;
    meetupLocation;
    imageUrl;
    status;
    available;
    createdAt;
    viewsCount;
    seller;
    wishlistedBy;
    cartItems;
    orderItems;
};
exports.Book = Book;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Book.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Book.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Book.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Book.prototype, "semester", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Book.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: Condition }),
    __metadata("design:type", String)
], Book.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", Number)
], Book.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { nullable: true }),
    __metadata("design:type", Number)
], Book.prototype, "originalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Book.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], Book.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Book.prototype, "meetupLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: Status, default: Status.PENDING }),
    __metadata("design:type", String)
], Book.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Book.prototype, "available", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Book.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Book.prototype, "viewsCount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.books),
    (0, typeorm_1.JoinColumn)({ name: "sellerId" }),
    __metadata("design:type", User_1.User)
], Book.prototype, "seller", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1.User),
    (0, typeorm_1.JoinTable)({ name: "wishlists" }),
    __metadata("design:type", Array)
], Book.prototype, "wishlistedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CartItem_1.CartItem, cartItem => cartItem.book),
    __metadata("design:type", Array)
], Book.prototype, "cartItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderItem_1.OrderItem, orderItem => orderItem.book),
    __metadata("design:type", Array)
], Book.prototype, "orderItems", void 0);
exports.Book = Book = __decorate([
    (0, typeorm_1.Entity)()
], Book);
