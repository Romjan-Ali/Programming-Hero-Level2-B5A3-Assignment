import { Schema, model } from 'mongoose'
import IBorrow from '../interfaces/borrow.interface'

const BorrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
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

const Borrow = model('Borrow', BorrowSchema)

export default Borrow
