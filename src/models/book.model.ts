import { Schema, model, Model, Document } from 'mongoose'
import IBook from '../interfaces/book.interface'

// Custom Document type to include methods
export interface BookDocument extends IBook, Document {
  updateAvailability(): void
}

const bookSchema = new Schema<BookDocument>(
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
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
)

// Instance method to update availability
bookSchema.methods.updateAvailability = function () {
  this.available = this.copies > 0
}

const Book = model<BookDocument>('Book', bookSchema)
export default Book
