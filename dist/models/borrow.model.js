"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const book_model_1 = __importDefault(require("./book.model"));
const BorrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId, // Book ID
        ref: 'Book', // Referenced book (to get book using book id)
        required: [true, 'Book reference is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be a positive number']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    }
}, { timestamps: true });
BorrowSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const borrow = this;
        try {
            const book = yield book_model_1.default.findById(borrow.book);
            if (!book) {
                throw new Error('Referenced book does not exist');
            }
            if (book.copies < borrow.quantity) {
                throw new Error('Not enough copies available');
            }
            book.copies -= borrow.quantity;
            if (book.copies === 0) {
                book.available = false;
            }
            yield book.save();
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
const Borrow = (0, mongoose_1.model)('Borrow', BorrowSchema);
exports.default = Borrow;
