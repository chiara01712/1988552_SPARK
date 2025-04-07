

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const studentRoutes = require('./src/student_route');
const RabbitMQNote = require('./src/rabbitmq/note-s');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse form data


app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'public' directory
app.use('', studentRoutes);

// 1. When a post request is made to /operate, call the produce method of the RabbitMQNote class
// go to the producer.js file and see the produce method


const port = 7070;
app.listen(port, async() => {
  console.log(`Student Server is running on port ${port}`);
  await RabbitMQNote.initialize(); // Initialize the RabbitMQ connection only when the server starts
  
});



