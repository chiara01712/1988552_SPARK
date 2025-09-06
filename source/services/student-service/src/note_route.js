const express = require('express');
const { NoteService } = require('./note_service');
const { NoteRepo } = require('./note_repo');
const RabbitMQNote = require('./rabbitmq/note-s');
const Note = require("./note")
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require("multer");
const fs = require('fs');


const router = express.Router();
const noteRepo = new NoteRepo(Note);
const noteService = new NoteService(noteRepo);

router.get('/', (req, res) => {
  res.redirect('/home');
});

// When a GET request is made to /my_note, send back my_note.html
router.get('/my_notes', (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    const error = encodeURIComponent('You need to login to access the website.');
    return res.redirect(`http://localhost:8080?error=${error}`);
  }
  try{
    // Verify the token using the same secret key used for signing
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Authenticated user: ",decoded);
    
    res.sendFile(path.join(__dirname, '..', 'public', 'my_note.html'));
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
});

router.get('/all_notes', (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    const error = encodeURIComponent('You need to login to access the website.');
    return res.redirect(`http://localhost:8080?error=${error}`);
  }
  try{
    // Verify the token using the same secret key used for signing
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Authenticated user: ",decoded);

    res.sendFile(path.join(__dirname, '..', 'public', 'all_notes.html'));
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

router.get('/getNotes', async (req, res) => {
    try {
        const response = await noteService.getNotesByStudentId (req, res);
        console.log("Response, notes:",response);
        
        if (response.status === 200) {
            res.json(response.data); // Send the notes as JSON response
        }
        else {
            res.status(response.status).json({ message: response.message });
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/deleteNote', async (req, res)=> {
  try {
      const response = await noteService.deleteNote (req, res);
      console.log("Response, notes:",response);
      
      if (response.status === 200) {
          res.json(response.data); // Send the notes as JSON response
      }
      else {
          res.status(response.status).json({ message: response.message });
      }
  } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/addNote', async (req, res) => {
    try {
        const response = await noteService.addNote(req, res);
        res.status(response.status).json({ message: response.message });

    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 1. When a post request is made to /getUsername, call the produce method of the RabbitMQNote class
// go to the producer.js file and see the produce method
router.post("/getUsername", async (req, res, next) => {
    console.log("/getUsername",req.body);
    console.log("Type of req.body:", typeof req.body);
    try {
      const response = await RabbitMQNote.produce(req.body);
      res.send({ response });
    } catch (error) {
      next(error); 
    }
});

// When a post request is made to /getCourses, call the produce method of the RabbitMQNote class
router.post("/getCourses", async (req, res, next) => {
  console.log("/getCourses",req.body);
  console.log("Type of req.body:", typeof req.body);
  try {
    const response = await RabbitMQNote.produce(req.body);
    res.send({ response });
  } catch (error) {
    next(error); 
  }
});

router.get("/getStudentPage", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try{
    // Verify the token using the same secret key used for signing
    const decoded = jwt.verify(token, '220fcf11de0e3f9307932fb2ff69258d190ecf08ef01d0d9c5d8d1c7c97d9149be27299a3ce8dfa0cbbfb6dc1328291786803344cdbf7f3916933a78ac47553e');
    console.log("Authenticated user: ",decoded);
    
    res.sendFile(path.join(__dirname, '..', 'public', 'student_home.html'));
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

router.get("/getNotesPage", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try{
    // Verify the token using the same secret key used for signing
    const decoded = jwt.verify(token, '220fcf11de0e3f9307932fb2ff69258d190ecf08ef01d0d9c5d8d1c7c97d9149be27299a3ce8dfa0cbbfb6dc1328291786803344cdbf7f3916933a78ac47553e');
    console.log("Authenticated user: ",decoded);
    
    res.sendFile(path.join(__dirname, '..', 'public', 'my_note.html'));
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});


  
router.get("/home", (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
      const error = encodeURIComponent('You need to login to access the website.');
      return res.redirect(`http://localhost:8080?error=${error}`);
    }
    try{
      // Verify the token using the same secret key used for signing
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Authenticated user: ",decoded);
      
      res.sendFile(path.join(__dirname, '..', 'public', 'student_home.html'));
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const addressLine = "./public/uploads";
    try {
      fs.mkdirSync(addressLine, { recursive: true }); // Create directory if it doesn't exist
      cb(null, addressLine);
    } catch (err) {
      cb(err); // Pass the error to multer
    }
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB file size limit
});

router.post('/upload', upload.single('file'), (req, res) => {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }
    return res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
});

  
module.exports = router;