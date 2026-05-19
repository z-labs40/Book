import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/auth/LoginUserUseCase';
import { logger } from '../../shared/loggers';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = new RegisterUserUseCase();
    const result = await useCase.execute(req.body);
    res.status(201).json({ message: 'User created successfully', ...result });
  } catch (error: any) {
    logger.error(`Registration error: ${error.message}`);
    if (error.message === 'User already exists' || error.message.includes('email')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const useCase = new LoginUserUseCase();
    const result = await useCase.execute(req.body);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Invalid credentials' || error.message.includes('Access denied')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
