

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./src/student_route');
const RabbitMQNote = require('./src/rabbitmq/note-s');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse form data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Allow CORS for requests from the specified frontend origin, because the frontend that makes the 
// request is on a different port (8080) than the backend (7070)
app.use(cors({
  origin: 'http://localhost:8080', 
  // credentials: true, // Allow credentials (cookies) to be sent
}));

// Serve static files from the 'public' directory
app.use('', userRoutes);

const port = 7070;
app.listen(port, async() => {
  console.log(`Student Server is running on port ${port}`);
  await RabbitMQNote.initialize(); // Initialize the RabbitMQ connection only when the server starts
  
});



