

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./src/student_route');
const RabbitMQNote = require('./src/rabbitmq/note-s');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse form data


app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'public' directory
app.use('', userRoutes);

// 1. When a post request is made to /operate, call the produce method of the RabbitMQNote class
// go to the producer.js file and see the produce method

app.post("/operate", async (req, res, next) => {
  console.log("/operate",req.body);
  console.log("Type of req.body:", typeof req.body);
  try {
    const response = await RabbitMQNote.produce(req.body);
    res.send({ response });
  } catch (error) {
    next(error); 
  }
});

const port = 7070;
app.listen(port, async() => {
  console.log(`Student Server is running on port ${port}`);
  await RabbitMQNote.initialize(); // Initialize the RabbitMQ connection only when the server starts
  
});



