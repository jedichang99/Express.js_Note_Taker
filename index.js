const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API routes
app.get("/api/notes", (req, res) => {
  const notesData = fs.readFileSync("db.json", "utf8");
  const notes = JSON.parse(notesData);
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const notesData = fs.readFileSync("db.json", "utf8");
  const notes = JSON.parse(notesData);

  // Generate a unique id for the new note
  newNote.id = generateUniqueId();

  notes.push(newNote);
  fs.writeFileSync("db.json", JSON.stringify(notes));

  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const notesData = fs.readFileSync("db.json", "utf8");
  const notes = JSON.parse(notesData);

  // Find the index of the note with the given id
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex !== -1) {
    // Remove the note from the array
    notes.splice(noteIndex, 1);
    fs.writeFileSync("db.json", JSON.stringify(notes));
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Helper function to generate a unique id for new notes
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}
