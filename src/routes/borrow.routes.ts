import { Router } from "express";
import { borrowBook, borrowedBooks } from "../controllers/borrow.controller";

const borrowRouter = Router()

borrowRouter.route('/').post(borrowBook).get(borrowedBooks)

export default borrowRouter

