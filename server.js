const fs = require("fs");
const { v4: uuidv4 } = require('uuid');//uuidv4();..returns unique id.
const path = require("path");
const express = require("express");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { db } = require("./db/db.json");

const PORT = process.env.PORT || 3001;

//API routes:
//Get (api/notes) reads the db.json file and rtn all saved notes as JSON
app.get("/api/notes", (req, res) => {
  res.json() = fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data);
    return data;
  });
});

//POst (api/notes) receives new note from client to save on req body,  adds note to the db.json file, then return the new note to the client--need to give each note a unique id when it's saved(npm package to do this??)

app.post("api/notes", (req, res)=>{
    console.info(`${req.method} request received to add a note`);
    const{title, text}=res.body;
    if (title&&text) {
        // Variable for the object we will save
        const newNote = {
          title,
          text,
          id: uuid(),
        };
        //obtain existing notes from db file..
       fs.readFile("./db/db.json", "utf8", (err, data) => {
            if (err) {
              throw err;
            }else{
                //convert string notes into a JSON object
                const parsedNotes=JSON.parse(data);
                //push new note object to this array of objects
                parsedNotes.push(newNote);
//write to the db file again with the new note added
                fs.writeFile(
                    './db/reviews.json',
                    JSON.stringify(parsedReviews, null, 4),
                    (err) =>{
                     if(err){throw err}else 
                     console.info('Successfully updated note!')}
                  )
            };
});
};
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

//trial route...
app.get("/", (req, res) => {
  res.send("Hello There!");
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
