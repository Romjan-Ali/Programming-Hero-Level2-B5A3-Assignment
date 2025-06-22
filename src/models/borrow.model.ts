import { Schema, model } from 'mongoose'
import IBorrow from '../interfaces/borrow.interface'
import Book from './book.model'

const BorrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId, // Book ID
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
  },
  { timestamps: true }
)

BorrowSchema.pre('save', async function(next) {
  const borrow = this
  try {
    const book = await Book.findById(borrow.book)
    if(!book) {
      throw new Error('Referenced book does not exist')
    }

    if(book.copies < borrow.quantity) {
      throw new Error('Not enough copies available')
    }

    book.copies -= borrow.quantity
    if(book.copies === 0){
      book.available = false
    }

    await book.save()

    next()
  } catch (err: any) {    
    next(err)
  }
})

const Borrow = model('Borrow', BorrowSchema)

export default Borrow
