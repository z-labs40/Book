"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBook = exports.getBookById = exports.getBooks = void 0;
const GetBooksUseCase_1 = require("../../application/use-cases/book/GetBooksUseCase");
const CreateBookUseCase_1 = require("../../application/use-cases/book/CreateBookUseCase");
const GetBookByIdUseCase_1 = require("../../application/use-cases/book/GetBookByIdUseCase");
const getBooks = async (req, res) => {
    try {
        const useCase = new GetBooksUseCase_1.GetBooksUseCase();
        const books = await useCase.execute(req.query);
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch books', details: error.message });
    }
};
exports.getBooks = getBooks;
const getBookById = async (req, res) => {
    try {
        const useCase = new GetBookByIdUseCase_1.GetBookByIdUseCase();
        const book = await useCase.execute(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch book details', details: error.message });
    }
};
exports.getBookById = getBookById;
const createBook = async (req, res) => {
    try {
        const sellerId = req.user.userId;
        const useCase = new CreateBookUseCase_1.CreateBookUseCase();
        const newBook = await useCase.execute(sellerId, req.body);
        res.status(201).json(newBook);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create book listing', details: error.message });
    }
};
exports.createBook = createBook;
