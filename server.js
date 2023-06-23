const express = require("express");

const fs = require("fs");

const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => res.send(data));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/api/notes", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let newNote = req.body;
  newNote.id = Math.floor(Math.random() * 10000000000) + 1;

  savedNotes.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  console.log("A new note has been saved: ", newNote);
  res.json(savedNotes);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
