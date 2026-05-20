"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../../infrastructure/database");
const User_1 = require("../../../adapters/models/User");
const loggers_1 = require("../../../shared/loggers");
const config_1 = require("../../../config");
class LoginUserUseCase {
    async execute(data) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const { email, password, isAdminLogin } = data;
        const user = await userRepository.findOneBy({ email });
        if (!user || !(await bcryptjs_1.default.compare(password, user.passwordHash))) {
            throw new Error('Invalid credentials');
        }
        if (isAdminLogin && user.role !== User_1.Role.ADMIN) {
            throw new Error('Access denied. Admin privileges required.');
        }
        if (!isAdminLogin && user.role === User_1.Role.ADMIN) {
            throw new Error('Access denied. Please use the admin portal.');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, config_1.config.jwt.secret, { expiresIn: config_1.config.jwt.expiresIn });
        loggers_1.logger.info(`User logged in: ${email}`);
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role === User_1.Role.ADMIN ? "admin" : "student"
            }
        };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
