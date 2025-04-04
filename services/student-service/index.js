

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./src/student_route');
const RabbitMQNote = require('./src/rabbitmq/note-s');
const jwt = require('jsonwebtoken');
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
  credentials: true, // Allow credentials (cookies) to be sent
}));


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


app.get("/home", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try{
    // Verify the token using the same secret key used for signing
    const decoded = jwt.verify(token, '220fcf11de0e3f9307932fb2ff69258d190ecf08ef01d0d9c5d8d1c7c97d9149be27299a3ce8dfa0cbbfb6dc1328291786803344cdbf7f3916933a78ac47553e');
    console.log("Authenticated user: ",decoded);
    
    res.sendFile(path.join(__dirname, 'public', 'student_home.html'));
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
);


const port = 7070;
app.listen(port, async() => {
  console.log(`Student Server is running on port ${port}`);
  await RabbitMQNote.initialize(); // Initialize the RabbitMQ connection only when the server starts
  
});



