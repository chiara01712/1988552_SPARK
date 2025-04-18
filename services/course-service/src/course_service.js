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

        if (!title || !professor_id) {
            return { status: 400, message: 'Invalid request: Missing fields' };
        }

        try {
            const course = await this.courseRepo.addCourse(id, title, description, professor_id, student_ids);
            if (!course) {
                return { status: 500, message: 'Internal server error' };
            }
            return { status: 200, message: 'Course added successfully' };
        } catch (error) {
            console.error('Error adding course:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    // Function to add a student to a course
    async addStudentToCourse(req) {
        const { course_id, student_id } = req.body;

        if (!course_id || !student_id) {
            return { status: 400, message: 'Invalid request: Missing fields' };
        }

        try {
            const updatedCourse = await this.courseRepo.addStudentToCourse(course_id, student_id);
            if (!updatedCourse) {
                return { status: 500, message: 'Failed to add student to course' };
            }

            return { status: 200, message: 'Student added to course successfully' };
        } catch (error) {
            console.error('Error adding student to course:', error);
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

    async getCoursesByStudentId(req) {
        try {
          const studentId = req.headers.student_id;  // Recupera lo student_id dai parametri della query
          if (!studentId) {
            console.log("YOOOOOOOO");
            return { status: 400, message: "Missing student_id" };
          }
          
          const courses = await this.courseRepo.findCoursesByStudentId(studentId);

          console.log("Corsi ricevuti in course_Service:", JSON.stringify(courses, null, 2));
          return { status: 200, data: courses };
        } catch (error) {
          console.error("Error in getCoursesByStudentId:", error);
          return { status: 500, message: "Internal server error" };
        }
      }

    async getQuizzesByCourseId(req) {
        const courseId = req.headers.course_id; // Extract courseId from request parameters
        console.log("Received courseId:", courseId);
        if (!courseId) {
            return { status: 400, message: 'Missing courseId' };
        }
        try {
            const quizzes = await this.courseRepo.getQuizzesByCourseId(courseId);
            return { status: 200, data: quizzes };
        } catch (error) {
            console.error('Error fetching quizzes for course:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }


}


module.exports = {CourseService};
