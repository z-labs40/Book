"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../../../infrastructure/database");
const User_1 = require("../../../adapters/models/User");
const loggers_1 = require("../../../shared/loggers");
class RegisterUserUseCase {
    async execute(data) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const { name, email, password } = data;
        if (!email.endsWith('@college.edu')) {
            throw new Error('Must use a valid @college.edu email');
        }
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = userRepository.create({
            name,
            email,
            passwordHash,
            role: User_1.Role.STUDENT
        });
        await userRepository.save(user);
        loggers_1.logger.info(`New user registered: ${email}`);
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
exports.RegisterUserUseCase = RegisterUserUseCase;
