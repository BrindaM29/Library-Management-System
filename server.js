const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// ======================
// DATA
// ======================

let books = [
    {
        id: 1,
        name: "The Alchemist",
        author: "Paulo Coelho",
        status: "Available"
    },
    {
        id: 2,
        name: "Atomic Habits",
        author: "James Clear",
        status: "Available"
    },
    {
        id: 3,
        name: "Clean Code",
        author: "Robert C. Martin",
        status: "Issued"
    }
];

let members = [
    {
        id: 1,
        name: "Brinda M",
        email: "brinda@gmail.com"
    },
    {
        id: 2,
        name: "Rahul Kumar",
        email: "rahul@gmail.com"
    },
    {
        id: 3,
        name: "Ananya Sharma",
        email: "ananya@gmail.com"
    }
];

let issuedBooks = [
    {
        bookId: 3,
        memberId: 2
    }
];

// ======================
// BOOK APIs
// ======================

// Get all books
app.get("/api/books", (req, res) => {
    res.json(books);
});

// Add a book
app.post("/api/books", (req, res) => {

    const { name, author } = req.body;

    if (!name || !author) {
        return res.status(400).json({
            message: "Book name and author are required"
        });
    }

    const newBook = {
        id: books.length + 1,
        name: name,
        author: author,
        status: "Available"
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// Delete a book
app.delete("/api/books/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.json({
        message: "Book deleted successfully"
    });
});

// ======================
// MEMBER APIs
// ======================

// Get all members
app.get("/api/members", (req, res) => {
    res.json(members);
});

// Add member
app.post("/api/members", (req, res) => {

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const newMember = {
        id: members.length + 1,
        name: name,
        email: email
    };

    members.push(newMember);

    res.status(201).json({
        message: "Member added successfully",
        member: newMember
    });
});

// ======================
// ISSUE BOOK
// ======================

app.post("/api/issue", (req, res) => {

    const { bookId, memberId } = req.body;

    const book = books.find(
        book => book.id === Number(bookId)
    );

    const member = members.find(
        member => member.id === Number(memberId)
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!member) {
        return res.status(404).json({
            message: "Member not found"
        });
    }

    if (book.status === "Issued") {
        return res.status(400).json({
            message: "Book is already issued"
        });
    }

    book.status = "Issued";

    issuedBooks.push({
        bookId: book.id,
        memberId: member.id
    });

    res.json({
        message: "Book issued successfully",
        book: book,
        member: member
    });
});

// ======================
// RETURN BOOK
// ======================

app.post("/api/return/:bookId", (req, res) => {

    const bookId = Number(req.params.bookId);

    const book = books.find(
        book => book.id === bookId
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.status === "Available") {
        return res.status(400).json({
            message: "Book is already available"
        });
    }

    book.status = "Available";

    issuedBooks = issuedBooks.filter(
        item => item.bookId !== bookId
    );

    res.json({
        message: "Book returned successfully",
        book: book
    });
});

// ======================
// ISSUED BOOKS
// ======================

app.get("/api/issued", (req, res) => {

    const result = issuedBooks.map(item => {

        const book = books.find(
            book => book.id === item.bookId
        );

        const member = members.find(
            member => member.id === item.memberId
        );

        return {
            book: book,
            member: member
        };
    });

    res.json(result);
});

// ======================
// SERVER
// ======================

app.listen(PORT, () => {
    console.log(
        `Library Management System running on port ${PORT}`
    );
});