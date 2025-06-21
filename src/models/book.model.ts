import { Schema, model } from 'mongoose'
import IBook from '../interfaces/book.interface'

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      required: true,
      enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: {
      type: Number,
      required: true,
      min: [0, 'Copies must be a non-negative number']
    },
    available: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
)

const Book = model<IBook>('Book', BookSchema)

export default Book
