import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book-notes",
  password: "1234",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//  GET ALL BOOKS

app.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM books ORDER BY created_at DESC",
    );
    // console.log(result);
    const book = result.rows;
    console.log(book);

    res.render("index.ejs", {
      books: result.rows,
      
    });
  } catch (error) {
    console.error(error);
  }
});

//  ADD BOOK (WITH API)

app.post("/add", async (req, res) => {
  try {
    const { title, rating, notes } = req.body;

    // 1. Search Open Library API
    const response = await axios.get(
      `https://openlibrary.org/search.json?title=${title}`,
    );

    const data = response.data.docs[0];
    // console.log(data);

    const authorName = response.data.docs[0].author_name[0];
    console.log(authorName);

    const bookName = response.data.docs[0].title;
    console.log(bookName);

    let cover_url = null;

    // 2. Build cover URL if exists
    if (data && data.cover_i) {
      cover_url = `https://covers.openlibrary.org/b/id/${data.cover_i}-L.jpg`;
    }

    // 3. Save to DB
    await db.query(
      "INSERT INTO books (title, author, rating, notes, cover_url) VALUES ($1, $2, $3, $4, $5)",
      [bookName, authorName, rating, notes, cover_url],
    );

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

//  EDIT BOOK

// app.post("/edit", async (req, res) => {
//   try {
//     const { bookId, title, author, rating, notes } = req.body;

//     await db.query(
//       "UPDATE books SET title=$1, author=$2, rating=$3, notes=$4 WHERE id=$5",
//       [title, author, rating, notes, bookId]
//     );

//     res.redirect("/");

//   } catch (error) {s
//     console.error(error);
//     res.redirect("/");
//   }
// });

//  DELETE BOOK

app.post("/delete", async (req, res) => {
  try {
    const { deleteBookId } = req.body;

    await db.query("DELETE FROM books WHERE id=$1", [deleteBookId]);

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

//  START SERVER

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
