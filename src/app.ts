import { Request, Response } from 'express'
import express, { Application } from 'express'
import bookRouter from './routes/book.routes'
import borrowRouter from './routes/borrow.routes'

const app: Application = express()

app.use(express.json())

app.use('/api/books', bookRouter)
app.use('/api/borrow', borrowRouter)

app.get('/api', (req: Request, res: Response) => {
    res.status(200).send(`Welcome to Library Management API`)
})

export default app