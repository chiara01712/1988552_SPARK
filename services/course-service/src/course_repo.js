const { use } = require("./course_route");

class CourseRepo{

    constructor(courseModel){
        this.courseModel = courseModel;
    }

    async addCourse(uuidV4, title, description, professor_id) {
        console.log("AAA", title, description, professor_id);
        try {
          const newCourse = await this.courseModel.create({
            id: uuidV4,       // Set the generated UUID
            title,              // Insert the title
            description,        // Insert the description
            professor_id        // Insert the professor id
          });
          return newCourse;     // Return the created course object
        } catch (error) {
          console.error("Error inserting user:", error);
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
    


} 

module.exports = {CourseRepo};