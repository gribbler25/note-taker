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

  // fs.readFile("./db/db.json", "utf8", (err, data) => {
  //   if (err) {
  //     throw err;
  //   }
  //   const notesData = JSON.parse(data);
  //   console.log(typeof notesData);

  //   res.json(notesData);
  // });
});

//POst (api/notes) receives new note from client to save on req body,  adds note to the db.json file, then return the new note to the client--need to give each note a unique id when it's saved(npm package to do this??)

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
    //obtain existing notes from db file..
    // fs.readFile("./db/db.json", "utf8", (err, notes) => {
    //   if (err) throw err;
    //   //convert string notes into a JSON object
    //   const parsedNotes = JSON.parse(notes);
    //   //push new note object to this array of objects

    //   //write to the db file again with the new note added
    //   fs.writeFile(
    //     "./db/db.json",
    //     JSON.stringify(parsedNotes, null, 4),
    //     (err) => {
    //       if (err) {
    //         throw err;
    //       } else console.info("Successfully updated note!");
    //     }
    //   );
    // });
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
