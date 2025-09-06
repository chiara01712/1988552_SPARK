require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const courseRoutes = require('./src/course_route');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const RabbitMQCourse = require('./src/rabbitmq/course-s');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse form data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Allow CORS for requests from the specified frontend origin, because the frontend that makes the 
// request is on a different port (8080) than the backend (7070)
app.use(cors({
  origin: 'http://localhost:8080', 
  // credentials: true, // Allow credentials (cookies) to be sent
}));

// Serve static files from the 'public' directory
app.use('', courseRoutes);




const port = 6060;
app.listen(port, async() => {
  console.log(`Server running on port ${port}`);
  await RabbitMQCourse.initialize(); // Initialize the RabbitMQ connection only when the server starts
});



