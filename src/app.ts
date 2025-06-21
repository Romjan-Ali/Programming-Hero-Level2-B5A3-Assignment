import express, { Application } from 'express'
import bookRouter from './routes/book.routes'
import borrowRouter from './routes/borrow.routes'

const app: Application = express()

app.use(express.json())

app.use('/api/books', bookRouter)
app.use('/api/borrow', borrowRouter)

export default app