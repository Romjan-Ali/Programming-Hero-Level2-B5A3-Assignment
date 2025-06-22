import { Types } from 'mongoose'

export default interface IBook {
  // _id?: Types.ObjectId
  title: string
  author: string
  genre: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY'
  isbn: string
  description?: string
  copies: number
  available?: boolean
  createdAt?: Date
  updatedAt?: Date
}
