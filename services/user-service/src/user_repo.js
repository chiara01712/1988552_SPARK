const { use } = require("./user_route");

class UserRepo{

    constructor(userModel){
        this.userModel = userModel;
    }

    async addUser(uuidV4, username, password) {
        console.log(username,password);
        try {
          const newUser = await this.userModel.create({
            id: uuidV4,       // Set the generated UUID
            username,         // Insert the username
            password          // Insert the password
          });
          return newUser;     // Return the created user object
        } catch (error) {
          console.error("Error inserting user:", error);
          return null;        // Return null in case of an error
        }
      }

    getAllUsers(){
        return this.userModel.findAll();
    }


}

module.exports = {UserRepo};