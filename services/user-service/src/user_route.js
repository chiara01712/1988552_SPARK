const express = require('express');
const { UserService } = require('./user_service');
const { UserRepo } = require('./user_repo');
const User = require("./user")

const router = express.Router();
//const userController = require('./usercontroller');
//router.post('/addUser', userController.addUser);
const userRepo = new UserRepo(User);
const userService = new UserService(userRepo);

// Signup endpoint
router.post('/signup', async (req, res) => {
    console.log(req.body);
    try {
        const response = await userService.addUser(req);
        console.log("JK",response);
        if (response.status === 200) {  // Assuming 201 means success
            res.redirect("/index");
            
        } else {
            res.status(response.status).send(response.message);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Recupero utente endpoint
router.post('/login', async (req, res) => {
    try {
        await userService.login(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// router.post('/home', async (req, res) => {
//     try {
//         const response = await fetch("http://localhost:7070/home");
//         const html = await response.text();
//         res.send(html); 
//     } catch (err) {
//         console.error("Error in loading home page:", err);
//         res.status(500).send("Error in loading the home page");
//     }
// });



module.exports = router;