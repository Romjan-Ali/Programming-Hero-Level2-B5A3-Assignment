"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controllers/book.controller");
const bookRouter = express_1.default.Router();
bookRouter.route('/').get(book_controller_1.getAllBooks).post(book_controller_1.createBook);
bookRouter.route('/:bookId').get(book_controller_1.getBookByUserIdParam).put(book_controller_1.bookUpdateById).delete(book_controller_1.bookDeleteById);
exports.default = bookRouter;
