const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// Function to generate a unique ID for a new note
function generateUniqueId(notes) {
  let id = 1;

  if (notes.length > 0) {
    const ids = notes.map((note) => note.id);
    id = Math.max(...ids) + 1;
  }

  return id;
}

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (err, data) => res.send(data))
});

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred while reading notes data." });
    }

    const notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = Math.floor(Math.random() * 10000000000) + 1;
    notes.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while saving the note." });
      }

      res.json(newNote);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
