const express = require('express');
const { StudentService } = require('./student_service');
const { StudentRepo } = require('./student_repo');
const RabbitMQNote = require('./rabbitmq/note-s');
const Note = require("./note")
const jwt = require('jsonwebtoken');
const path = require('path');

const router = express.Router();
const studentRepo = new StudentRepo(Note);
const studentService = new StudentService(studentRepo);

router.get('/getNotes', async (req, res) => {
    try {
        const response = await studentService.getNotesByStudentId (req, res);
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
        await studentService.addNote(req, res);

    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 1. When a post request is made to /operate, call the produce method of the RabbitMQNote class
// go to the producer.js file and see the produce method
router.post("/operate", async (req, res, next) => {
    console.log("/operate",req.body);
    console.log("Type of req.body:", typeof req.body);
    try {
      const response = await RabbitMQNote.produce(req.body);
      res.send({ response });
    } catch (error) {
      next(error); 
    }
});
  
  
router.get("/home", (req, res) => {
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

  
module.exports = router;