import bcrypt from 'bcryptjs';
import { AppDataSource } from '../../../infrastructure/database';
import { User, Role } from '../../../adapters/models/User';
import { logger } from '../../../shared/loggers';

export class RegisterUserUseCase {
  async execute(data: any) {
    const userRepository = AppDataSource.getRepository(User);
    const { name, email, password } = data;

    if (!email.endsWith('@college.edu')) {
      throw new Error('Must use a valid @college.edu email');
    }

    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      name,
      email,
      passwordHash,
      role: Role.STUDENT
    });

    await userRepository.save(user);
    logger.info(`New user registered: ${email}`);

    return {
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "student"
      }
    };
  }
}
