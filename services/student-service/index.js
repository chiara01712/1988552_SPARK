

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./src/student_route');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse form data


app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'public' directory
app.use('', userRoutes);


const port = 7070;
app.listen(port, () => {
  console.log(`Student Server is running on port ${port}`);
});



