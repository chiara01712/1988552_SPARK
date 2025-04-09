const express = require('express');
const { CourseService } = require('./course_service');
const { CourseRepo } = require('./course_repo');
const RabbitMQcourse = require('./rabbitmq/course-s');
const Course = require("./course")
const jwt = require('jsonwebtoken');
const path = require('path');

const router = express.Router();
const courseRepo = new CourseRepo(Course);
const courseService = new CourseService(courseRepo);

router.get('/getcourses', async (req, res) => {
    try {
        const response = await courseService.getCoursesByProfessorId (req, res);
        //console.log("Response, courses:",response);
        
        if (response.status === 200) {
            res.json(response.data); // Send the courses as JSON response
        }
        else {
            res.status(response.status).json({ message: response.message });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/addCourse', async (req, res) => {
    try {
        await courseService.addCourse(req, res);

    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 1. When a post request is made to /getUsername, call the produce method of the RabbitMQcourse class
// go to the producer.js file and see the produce method
router.post("/getUsername", async (req, res, next) => {
    console.log("/getUsername",req.body);
    console.log("Type of req.body:", typeof req.body);
    try {
      const response = await RabbitMQcourse.produce(req.body);
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
      
      res.sendFile(path.join(__dirname, '..', 'public', 'course_home.html'));
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
});

  
module.exports = router;