import bcrypt from 'bcryptjs';
import { AppDataSource } from './database';
import { User, Role } from '../adapters/models/User';
import { Book, Status, Condition } from '../adapters/models/Book';
import { Order, OrderStatus } from '../adapters/models/Order';
import { logger } from '../shared/loggers';

export const seedAdmin = async () => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const bookRepo = AppDataSource.getRepository(Book);
    const orderRepo = AppDataSource.getRepository(Order);
    
    // 1. Seed Admin
    const adminExists = await userRepo.findOneBy({ role: Role.ADMIN });
    let adminUser;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@college.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    if (!adminExists) {
      adminUser = userRepo.create({
        name: 'System Administrator',
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
        department: 'Administration',
        semester: 0
      });
      await userRepo.save(adminUser);
      logger.info(`Successfully seeded default Admin account -> Email: ${adminEmail} | Password: ${adminPassword}`);
    } else {
      adminUser = adminExists;
      logger.info(`Admin account already exists: ${adminExists.email}`);
    }

    // 2. Seed Students individually
    const studentPasswordHash = await bcrypt.hash('StudentPassword123!', 10);
    
    let studentA = await userRepo.findOneBy({ email: 'john@college.edu' });
    if (!studentA) {
      studentA = userRepo.create({
        name: 'John Student',
        email: 'john@college.edu',
        passwordHash: studentPasswordHash,
        role: Role.STUDENT,
        department: 'Computer Science',
        semester: 4,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        rating: 4.8,
        totalSales: 0
      });
      await userRepo.save(studentA);
      logger.info('Seeded John Student');
    }

    let studentB = await userRepo.findOneBy({ email: 'emma@college.edu' });
    if (!studentB) {
      studentB = userRepo.create({
        name: 'Emma Student',
        email: 'emma@college.edu',
        passwordHash: studentPasswordHash,
        role: Role.STUDENT,
        department: 'Electrical Engineering',
        semester: 6,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        rating: 4.9,
        totalSales: 0
      });
      await userRepo.save(studentB);
      logger.info('Seeded Emma Student');
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
        condition: Condition.GOOD,
        price: 45.00,
        originalPrice: 120.00,
        description: 'Excellent condition textbook, minimal highlights on first few pages.',
        tags: ['algorithms', 'CLRS', 'computer science'],
        meetupLocation: 'Campus Library Floor 2',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        status: Status.PENDING,
        available: true,
        viewsCount: 14
      });
      book1.seller = studentA;
      await bookRepo.save(book1);
      logger.info('Seeded book Introduction to Algorithms');
    }

    let book2 = await bookRepo.findOneBy({ title: 'Engineering Electromagnetics' });
    if (!book2 && studentB) {
      book2 = bookRepo.create({
        title: 'Engineering Electromagnetics',
        author: 'William H. Hayt',
        department: 'Electrical Engineering',
        semester: 6,
        subject: 'Electromagnetics',
        condition: Condition.NEW,
        price: 65.00,
        originalPrice: 150.00,
        description: 'Brand new, never used, perfect condition.',
        tags: ['electromagnetics', 'engineering', 'hayt'],
        meetupLocation: 'Science Building Lobby',
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80',
        status: Status.ACTIVE,
        available: true,
        viewsCount: 32
      });
      book2.seller = studentB;
      await bookRepo.save(book2);
      logger.info('Seeded book Engineering Electromagnetics');
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
          status: OrderStatus.PENDING,
          buyer: studentA,
          seller: studentB,
          book: book2
        });
        await orderRepo.save(order);
        logger.info('Seeded test customer order');
      }
    }

  } catch (error: any) {
    logger.error(`Error seeding database: ${error.message}`);
  }
};
