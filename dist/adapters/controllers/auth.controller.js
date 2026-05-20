"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const RegisterUserUseCase_1 = require("../../application/use-cases/auth/RegisterUserUseCase");
const LoginUserUseCase_1 = require("../../application/use-cases/auth/LoginUserUseCase");
const loggers_1 = require("../../shared/loggers");
const register = async (req, res) => {
    try {
        const useCase = new RegisterUserUseCase_1.RegisterUserUseCase();
        const result = await useCase.execute(req.body);
        res.status(201).json({ message: 'User created successfully', ...result });
    }
    catch (error) {
        loggers_1.logger.error(`Registration error: ${error.message}`);
        if (error.message === 'User already exists' || error.message.includes('email')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const useCase = new LoginUserUseCase_1.LoginUserUseCase();
        const result = await useCase.execute(req.body);
        res.json(result);
    }
    catch (error) {
        if (error.message === 'Invalid credentials' || error.message.includes('Access denied')) {
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
