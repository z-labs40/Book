"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("./database");
const User_1 = require("../adapters/models/User");
const Book_1 = require("../adapters/models/Book");
const Order_1 = require("../adapters/models/Order");
const loggers_1 = require("../shared/loggers");
const seedAdmin = async () => {
    try {
        const userRepo = database_1.AppDataSource.getRepository(User_1.User);
        const bookRepo = database_1.AppDataSource.getRepository(Book_1.Book);
        const orderRepo = database_1.AppDataSource.getRepository(Order_1.Order);
        // 1. Seed Admin
        const adminExists = await userRepo.findOneBy({ role: User_1.Role.ADMIN });
        let adminUser;
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@college.edu';
        const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
        const passwordHash = await bcryptjs_1.default.hash(adminPassword, 10);
        if (!adminExists) {
            adminUser = userRepo.create({
                name: 'System Administrator',
                email: adminEmail,
                passwordHash,
                role: User_1.Role.ADMIN,
                department: 'Administration',
                semester: 0
            });
            await userRepo.save(adminUser);
            loggers_1.logger.info(`Successfully seeded default Admin account -> Email: ${adminEmail} | Password: ${adminPassword}`);
        }
        else {
            adminUser = adminExists;
            loggers_1.logger.info(`Admin account already exists: ${adminExists.email}`);
        }
        // 2. Seed Students individually
        const studentPasswordHash = await bcryptjs_1.default.hash('StudentPassword123!', 10);
        let studentA = await userRepo.findOneBy({ email: 'john@college.edu' });
        if (!studentA) {
            studentA = userRepo.create({
                name: 'John Student',
                email: 'john@college.edu',
                passwordHash: studentPasswordHash,
                role: User_1.Role.STUDENT,
                department: 'Computer Science',
                semester: 4,
                avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
                rating: 4.8,
                totalSales: 0
            });
            await userRepo.save(studentA);
            loggers_1.logger.info('Seeded John Student');
        }
        let studentB = await userRepo.findOneBy({ email: 'emma@college.edu' });
        if (!studentB) {
            studentB = userRepo.create({
                name: 'Emma Student',
                email: 'emma@college.edu',
                passwordHash: studentPasswordHash,
                role: User_1.Role.STUDENT,
                department: 'Electrical Engineering',
                semester: 6,
                avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
                rating: 4.9,
                totalSales: 0
            });
            await userRepo.save(studentB);
            loggers_1.logger.info('Seeded Emma Student');
        }
        // 3. Seed Books individually
        let book1 = await bookRepo.findOneBy({ title: 'Introduction to Algorithms, 3rd Edition' });
        if (!book1 && studentA) {
            book1 = bookRepo.create({
                title: 'Introduction to Algorithms, 3rd Edition',
                author: 'Thomas H. Cormen',
                department: 'Computer Science',
                semester: 5,
                subject: 'Algorithms',
                condition: Book_1.Condition.GOOD,
                price: 45.00,
                originalPrice: 120.00,
                description: 'Excellent condition textbook, minimal highlights on first few pages.',
                tags: ['algorithms', 'CLRS', 'computer science'],
                meetupLocation: 'Campus Library Floor 2',
                imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
                status: Book_1.Status.PENDING,
                available: true,
                viewsCount: 14
            });
            book1.seller = studentA;
            await bookRepo.save(book1);
            loggers_1.logger.info('Seeded book Introduction to Algorithms');
        }
        let book2 = await bookRepo.findOneBy({ title: 'Engineering Electromagnetics' });
        if (!book2 && studentB) {
            book2 = bookRepo.create({
                title: 'Engineering Electromagnetics',
                author: 'William H. Hayt',
                department: 'Electrical Engineering',
                semester: 6,
                subject: 'Electromagnetics',
                condition: Book_1.Condition.NEW,
                price: 65.00,
                originalPrice: 150.00,
                description: 'Brand new, never used, perfect condition.',
                tags: ['electromagnetics', 'engineering', 'hayt'],
                meetupLocation: 'Science Building Lobby',
                imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80',
                status: Book_1.Status.ACTIVE,
                available: true,
                viewsCount: 32
            });
            book2.seller = studentB;
            await bookRepo.save(book2);
            loggers_1.logger.info('Seeded book Engineering Electromagnetics');
        }
        // 4. Seed Order if it doesn't exist
        if (studentA && studentB && book2) {
            const orderExists = await orderRepo.findOne({
                where: {
                    buyer: { id: studentA.id },
                    seller: { id: studentB.id },
                    book: { id: book2.id }
                }
            });
            if (!orderExists) {
                const order = orderRepo.create({
                    totalAmount: book2.price,
                    status: Order_1.OrderStatus.PENDING,
                    buyer: studentA,
                    seller: studentB,
                    book: book2
                });
                await orderRepo.save(order);
                loggers_1.logger.info('Seeded test customer order');
            }
        }
    }
    catch (error) {
        loggers_1.logger.error(`Error seeding database: ${error.message}`);
    }
};
exports.seedAdmin = seedAdmin;
