const { use } = require("./user_route");

class UserRepo{

    constructor(userModel){
        this.userModel = userModel;
    }

    async addUser(uuidV4, username, role,email, password) {
      console.log("ZZZZ",username,role,email,password);
        try {
          const newUser = await this.userModel.create({
            id: uuidV4,       // Set the generated UUID
            username,         // Insert the username
            role,             // Insert the role
            password,          // Insert the password
            email              // Insert the email
          });
          return newUser;     // Return the created user object
        } catch (error) {
          console.error("Error inserting user:", error);
          return null;        // Return null in case of an error
        }
      }

      async getUserByUsername(email,password) {
        return  await this.userModel.findOne({ where: { email, password } });
    }
    


} 

module.exports = {UserRepo};