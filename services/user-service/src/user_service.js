const uuid = require('uuid');

class UserService{
    constructor(userRepo){
        this.userRepo = userRepo;
    }

    // Function to add a user to the database
    async addUser(req){
        const {username, role,email, password} = req.body;
        const id = uuid.v4();

        const response = {};

        if(!username || !role || !password || !id || !email){
            response.status = 400;
            //console.log(req.body);
            response.message = 'Invalid request';
            return response;
        }
        try {
            const user = await this.userRepo.addUser(id, username,role,  email, password);
            console.log(username,role, email, password);
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

    async getUser(req) {
        const { email, password } = req.body;
        console.log("AAAA",email,"BBBB",password);
        const response = {};
    
        if (!email || !password) {
            response.status = 400;
            response.message = 'Invalid request';
            return response;
        }
    
        try {
            const user = await this.userRepo.getUserByUsername(email, password);
    
            if (!user) {
                response.status = 404;
                response.message = 'Missing user';
                return response;
            }
    
            response.status = 200;
            response.data = user; // Restituisci l'utente trovato
            return response;
        } catch (error) {
            console.error('Error fetching user:', error);
            response.status = 500;
            response.message = 'Internal server error';
            return response;
        }
    }



}

module.exports = {UserService};
