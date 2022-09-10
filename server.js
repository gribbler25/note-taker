//able to use async/ await and not callbacks throughout now
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); //uuidv4();..returns unique id.
const express = require("express");
const { notes } = require("./db/db.json");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//cleaner way to encapsulate the read/ write file in fxn that can be used again
function readNotes() {
  return fs.readFile("./db/db.json", "utf8"); // connected to using async/ await (.then also an option)
}

function writeNotes(parsedNotes) {
  return fs.writeFile("./db/db.json", JSON.stringify(parsedNotes, null, 4)); // connected to using async/ await (.then also an option)
}

//API routes:
//Get (api/notes) reads the db.json file and rtn all saved notes as JSON
app.get("/api/notes", async (req, res) => {
  try {
    const notesData = JSON.parse(await readNotes());
    res.json(notesData);
  } catch (err) {
    throw new Error(err);
  }
});

//attmepted to set up a delete route for the front end code. returning 404 currently..
app.delete("/api/notes/:id", async (req, res) => {
  // console.info(`${req.method} request received to delete note`);
  const noteId = req.params.id;
  const newArray = [];
  const notesData = JSON.parse(await readNotes());
  notesData.forEach((element) => {
    if (element.id !== noteId) newArray.push(element);
  });
  const newFile = await writeNotes(newArray);
  const response = {
    status: "success",
    body: newFile,
  };
  console.log(response);
  res.json(response);
});

//POst (api/notes) receives new note from client to save on req body,  adds note to the db.json file, then return the new note to the client--need to give each note a unique id when it's saved
app.post("/api/notes", async (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const notesData = JSON.parse(await readNotes());

  const { title, text } = req.body;

  console.log(title, text);
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    console.log(newNote);
    notesData.push(newNote);
    writeNotes(notesData);

    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);
    res.json(response);
  } else {
    res.json("Error in posting note");
  }
});

//html routes:
//Get (/notes) route to rtn the notes.html file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//Get (*) route to rtn the index.html file upon load
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
