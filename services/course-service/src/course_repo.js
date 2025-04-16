const { use } = require("./course_route");
const { Op } = require("sequelize");

class CourseRepo{

    constructor(courseModel){
        this.courseModel = courseModel;
    } 

    async addCourse(uuidV4, title, description, professor_id, student_ids) {
        console.log("AAA", title, description, professor_id, student_ids);
        try {
          const newCourse = await this.courseModel.create({
            id: uuidV4,       // Set the generated UUID
            title,              // Insert the title
            description,        // Insert the description
            professor_id,        // Insert the professor id
            student_ids
          });
          return newCourse;     // Return the created course object
        } catch (error) {
          console.error("Error inserting course:", error);
          return null;        // Return null in case of an error
        }
      }

      async getCourseByProfessor(professor_id) {
        try {
          return await this.courseModel.findAll({ where: { professor_id } });
      } catch (error) {
          console.error("Error fetching courses for course:", error);
          return [];
      }
    }

    async getCoursesByProfessorId(professor_id) {

      const courses = await this.courseModel.findAll({ where: { professor_id } });
      if(courses){
        const allDataValues = courses.map(course => course.dataValues);
        console.log(allDataValues);
        return allDataValues;  // Return the raw data
      } else{
          console.log("No courses found for professor");
          return null;
      }
    }
    
    async addStudentToCourse(course_id, student_id) {
      try {
        const course = await this.courseModel.findOne({ where: { course_id } });
        if (!course) {
          console.log("Course not found");
          return null;
        }

        const studentIds = course.student_ids || [];
        if (!studentIds.includes(student_id)) {
          studentIds.push(student_id);
          course.student_ids = studentIds;
          await course.save();
          console.log("Student added to course");
          return course;
        } else {
          console.log("Student already enrolled in the course");
          return course;
        }
      } catch (error) {
        console.error("Error adding student to course:", error);
        return null;
      }
    }

    // Functions for RabbitMQ
    async getCoursesByStudentId(student_id) {
      const courses = await this.courseModel.findAll({ 
        where: {  student_ids: { [Op.contains]: [student_id]}}
      }); 
      if (courses && courses.length > 0) {
        const courseData = courses.map(course => course.dataValues);
        console.log("Courses is: ", courseData);
        return courseData;
      } else {
        console.log("Courses not found");
        return null;
      }

    }
    
} 

module.exports = {CourseRepo};