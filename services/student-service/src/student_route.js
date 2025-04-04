const express = require('express');
const { StudentService } = require('./student_service');
const { StudentRepo } = require('./student_repo');
const Note = require("./note")

const router = express.Router();
//const userController = require('./usercontroller');
//router.post('/addUser', userController.addUser);
const studentRepo = new StudentRepo(Note);
const studentService = new StudentService(studentRepo);

router.get('/get_notes', async (req, res) => {
    try {
        const { student_id } = req.query; // Extract student_id from request query
        const response = await studentService.getNotesByStudentId(student_id);
        res.status(response.status).json(response.data || { message: response.message });
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

module.exports = router;