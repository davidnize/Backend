import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "1234",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const list = await db.query("SELECT * FROM items ORDER BY id ASC");
    const items = list.rows;
  
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
    
  } catch (error) {
    console.error(error);
    
  }
});

app.post("/add", async (req, res) => {
try {
  const item = req.body.newItem;
  console.log(item);

  const list = await db.query(
    "INSERT INTO items (title) VALUES ($1) RETURNING * ;",
    [item],
  );
  // console.log(list);

  res.redirect("/");
  
} catch (error) {
  console.error(error);
  
}
});

app.post("/edit", async (req, res) => {
  try {
    const item = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;
  
    console.log(item);
  
    const list = await db.query(
      "UPDATE items SET title = ($1) WHERE id = $2 RETURNING *;",
      [item, id],
    );
    
  } catch (error) {
    console.error(error);
    
  }

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  try {
    const id = req.body.deleteItemId;
   await db.query("DELETE FROM items WHERE id = $1", [id]);
    
  } catch (error) {
    console.error(error);
    
  }
  
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
