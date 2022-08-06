//html routes:
//Get (/notes) route to rtn the notes.html file
router.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/notes.html"));
});

//Get (*) route to rtn the index.html file upon load
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});
