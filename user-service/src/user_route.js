const express = require('express');
const { UserService } = require('./user_service');
const { UserRepo } = require('./user_repo');

const router = express.Router();
//const userController = require('./usercontroller');
//router.post('/addUser', userController.addUser);
const userService = new UserService(new UserRepo());

// Signup endpoint
router.post('/signup', async (req, res) => {
    try {
        const response = await userService.addUser(req);
        res.status(response.status).send(response.message);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;