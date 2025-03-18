const uuid = require('uuid');

class UserService{
    constructor(userRepo){
        this.userRepo = userRepo;
    }

    // Function to add a user to the database
    async addUser(req){
        const {username, password } = req.body;
        const id = uuid.v4();

        const response = {};

        if(!username || !password){
            response.status = 400;
            response.message = 'Invalid request';
            return response;
        }
        try {
            const user = await this.userRepo.addUser(id, username, password);

            if(!user){
                response.status = 500;
                response.message = 'Internal server error';
                return response;
            }

            response.status = 200;
            response.message = 'User added successfully';
            return response;
        } catch (error) {
            console.error('Error adding user:', error); // Log the error
            response.status = 500;
            response.message = 'Internal server error';
            return response;
        }
    }
}

module.exports = {UserService};
