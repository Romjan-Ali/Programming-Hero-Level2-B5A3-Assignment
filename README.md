# Library Management API

A RESTful API for managing books and borrow records in a library, built with **Express**, **TypeScript**, and **MongoDB** (using Mongoose). This API supports CRUD operations on books, borrowing management with business logic enforcement, and aggregated reports.

---

## Features

- **Book Management**  
  - Create, read, update, and delete books  
  - Genre filtering, sorting, and pagination support  
  - Validation of input data using Zod  
  - Enforces unique ISBN and schema validations  

- **Borrow Management**  
  - Borrow books with quantity control  
  - Deduct copies and automatically update availability  
  - Borrowed books summary using MongoDB aggregation pipeline  
  - Input validation using Zod schemas  

- **Business Logic**  
  - Ensures available copies before borrowing  
  - Automatically updates book availability status  
  - Encapsulated logic using Mongoose instance methods and middleware (hooks)  

- **Error Handling**  
  - Consistent error response format  
  - Validation errors and server errors handling  

---

## Technologies Used

- Node.js & Express.js  
- TypeScript  
- MongoDB & Mongoose  
- Zod for schema validation  
- ESLint & Prettier (optional for code quality)  

---

## API Endpoints

### Book Routes

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/books`         | Create a new book              |
| GET    | `/api/books`         | Get all books (filter, sort)  |
| GET    | `/api/books/:bookId` | Get book by ID                |
| PUT    | `/api/books/:bookId` | Update book by ID             |
| DELETE | `/api/books/:bookId` | Delete book by ID             |

### Borrow Routes

| Method | Endpoint       | Description                    |
| ------ | -------------- | ------------------------------ |
| POST   | `/api/borrow`  | Borrow a book                  |
| GET    | `/api/borrow`  | Get summary of borrowed books |

---

## Live Production

You can access the live version of the Library Management API here:

[https://programming-hero-level2-b5-a3-assig.vercel.app/api/](https://programming-hero-level2-b5-a3-assig.vercel.app/api/)

---

## Request/Response Examples

### Create Book

**POST** `/api/books`

Request Body:

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

Response:

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

### Borrow a Book

**POST** `/api/borrow`

Request Body:

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

Response:

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

### Borrowed Books Summary

**GET** `/api/borrow`

Response:

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## Installation & Setup

1. Clone the repo:

```sh
git clone https://github.com/your-username/library-management-api.git
cd library-management-api
```

2. Install dependencies:

```sh
npm install
```

3. Set environment variables (create `.env` file):

```env
MONGO_URI=mongodb://localhost:27017/library_db
PORT=5000
```

4. Run the development server:

```sh
npm run dev
```

---

## Project Structure

```go
├── src
│   ├── controllers
│   │   ├── book.controller.ts
│   │   └── borrow.controller.ts
│   ├── interfaces
│   │   ├── book.interface.ts
│   │   └── borrow.interface.ts
│   ├── models
│   │   ├── book.model.ts
│   │   └── borrow.model.ts
│   ├── routes
│   │   ├── book.routes.ts
│   │   └── borrow.routes.ts
│   ├── validations
│   │   ├── book.validation.ts
│   │   └── borrow.validation.ts
│   ├── middlewares
│   │   └── globalErrorHandler.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## Notes

- Validation: Uses Zod for request schema validation.

- Business Logic: Borrowing logic ensures copies are deducted and availability updated automatically.

- Mongoose Features: Uses instance/static methods and middleware (hooks) to enforce business rules.

- Aggregation: MongoDB aggregation pipeline used for summary reports.

- Error Handling: Centralized error handler returns consistent error responses.

---

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any questions or support, contact: [000romjanali@gmail.com](mailto:000romjanali@gmail.com)