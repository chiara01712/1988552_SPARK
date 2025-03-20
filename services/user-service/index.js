

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./src/user_route');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse form data


app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'public' directory
app.use('', userRoutes);

// When a GET request is made to the root URL, send back index.html
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



