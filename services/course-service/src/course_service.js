const uuid = require('uuid');

class CourseService{
    constructor(courseRepo){
        this.courseRepo = courseRepo;
    }

    // Function to add a course to the database
    async addCourse(req) {
        console.log("Received Request Body:", req.body); // Debugging log

        const { title, description, professor_id} = req.body;
        const id = require('uuid').v4(); // Generate a UUID for the course

        if (! !title || !professor_id) {
            return { status: 400, message: 'Invalid request: Missing fields' };
        }

        try {
            const course = await this.courseRepo.addCourse(id, title, description, professor_id);
            if (!course) {
                return { status: 500, message: 'Internal server error' };
            }
            return { status: 200, message: 'Course added successfully' };
        } catch (error) {
            console.error('Error adding course:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }

    // New method to fetch all courses
    async getCoursesByProfessorId(req) {
   
       const professor_id = req.headers.professor_id; // Extract professor_id from headers
       console.log("Received professor_id:", professor_id); 
        if(!professor_id) {
            return { status: 400, message: 'Missing professor_id' };
        }
    
        try {
            const courses = await this.courseRepo.getCoursesByProfessorId(professor_id);
            return { status: 200, data: courses };
        } catch (error) {
            console.error('Error fetching courses for professor:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
}


module.exports = {CourseService};
