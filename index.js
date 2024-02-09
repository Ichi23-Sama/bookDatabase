import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "book",
    password: "ichi1307",
    port: 5432,
});
db.connect();

app.get("/", async(req, res) => {
    try {
        const response = await db.query("SELECT * FROM books");
        const date = await db.query("SELECT TO_CHAR(dateadded::date, 'Mon dd, yyyy') FROM books");

        res.render("index.ejs", {
           books: response.rows, 
           dates: date.rows
        });
    } catch (err) {
        console.log(err);
    }
});

app.get("/new", async (req, res) => {
    try {
        res.render("modify.ejs", {
            heading: "New Post", 
            submit: "Create Post",
        });
    } catch (err) {
        console.log(err);
    }
});

app.get("/edit", async (req, res) => {
    const bookID = req.query.bookID;
    try {
        res.render("modify.ejs", {
            heading: "Update Post", 
            submit: "Update Post",
            bookID: bookID
        });
    } catch (err) {
        console.log(err);        
    }
});

app.post("/add", async (req,res) => {
    const response = req.body;
    const newBook = {
        name: response.name,
        author: response.author,
        rating: response.rating,
        isbn: response.isbn,
        review: response.review,
        date: response.date
    }
    console.log("Creating newbook: " + newBook.name);
    await db.query("INSERT INTO books (name, rating, review, dateadded, author, isbn) VALUES ($1, $2, $3, $4, $5, $6)", 
    [   newBook.name,
        newBook.rating, 
        newBook.review, 
        newBook.date,
        newBook.author,
        newBook.isbn
    ]);
    res.redirect("/");
});

app.post("/edit", async (req, res) => {
    const response = req.body;
    console.log("Editing book ID: " + req.body.bookID);
    const newBook = {
        name: response.name,
        author: response.author,
        rating: response.rating,
        isbn: response.isbn,
        review: response.review,
        date: response.date,
        bookID: response.bookID
    }
    console.log(newBook);
    
    try {
        await db.query("UPDATE books  SET name = ($1),rating = ($2),review = ($3),dateadded = ($4),author = ($5), isbn = ($6) WHERE id = ($7)", 
        [   newBook.name,
            newBook.rating, 
            newBook.review, 
            newBook.date,
            newBook.author,
            newBook.isbn,
            newBook.bookID
        ]);
    } catch (err) {
        console.log(err);        
    }
    res.redirect("/");
});

app.post("/delete", async (req, res) => {
    const bookID = req.body.deleteID;
    console.log("DELETE BOOK ID:"+bookID);
    try {
        await db.query(`DELETE FROM books WHERE id = $1`, [bookID]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});