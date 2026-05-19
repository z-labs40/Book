import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../../infrastructure/database';
import { User, Role } from '../../../adapters/models/User';
import { logger } from '../../../shared/loggers';
import { config } from '../../../config';

export class LoginUserUseCase {
  async execute(data: any) {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password, isAdminLogin } = data;

    const user = await userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    if (isAdminLogin && user.role !== Role.ADMIN) {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    if (!isAdminLogin && user.role === Role.ADMIN) {
      throw new Error('Access denied. Please use the admin portal.');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    logger.info(`User logged in: ${email}`);
    
    return { 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role === Role.ADMIN ? "admin" : "student" 
      } 
    };
  }
}
