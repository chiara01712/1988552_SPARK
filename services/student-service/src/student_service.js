const uuid = require('uuid');

class StudentService{
    constructor(studentRepo){
        this.studentRepo = studentRepo;
    }

    // Function to add a note to the database
    async addNote(req) {
        console.log("Received Request Body:", req.body); // Debugging log

        const { student_id, course_id, title, description, file_url, file_type } = req.body;
        const id = require('uuid').v4(); // Generate a UUID for the note

        if (!student_id || !course_id || !title || !file_url || !file_type) {
            return { status: 400, message: 'Invalid request: Missing fields' };
        }

        try {
            const note = await this.studentRepo.addNote(id, student_id, course_id, title, description, file_url, file_type);
            if (!note) {
                return { status: 500, message: 'Internal server error' };
            }
            return { status: 200, message: 'Note added successfully' };
        } catch (error) {
            console.error('Error adding note:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }

    // New method to fetch all notes
    async getNotesByStudentId(student_id) {
        if (!student_id) {
            return { status: 400, message: 'Missing student_id' };
        }
    
        try {
            const notes = await this.studentRepo.getNotesByStudentId(student_id);
            return { status: 200, data: notes };
        } catch (error) {
            console.error('Error fetching notes for student:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
}


module.exports = {StudentService};
