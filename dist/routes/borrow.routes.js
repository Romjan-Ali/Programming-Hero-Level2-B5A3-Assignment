"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const borrow_controller_1 = require("../controllers/borrow.controller");
const borrowRouter = (0, express_1.Router)();
borrowRouter.route('/').post(borrow_controller_1.borrowBook).get(borrow_controller_1.borrowedBooks);
exports.default = borrowRouter;
