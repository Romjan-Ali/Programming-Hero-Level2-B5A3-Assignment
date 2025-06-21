import express from 'express'
import { bookDeleteById, bookUpdateById, createBook, getAllBooks, getBookByUserIdParam } from '../controllers/book.controller'

const bookRouter = express.Router()

bookRouter.route('/').get(getAllBooks).post(createBook)
bookRouter.route('/:bookId').get(getBookByUserIdParam).put(bookUpdateById).delete(bookDeleteById)


export default bookRouter