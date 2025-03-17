const {UserService} = require('./user_service');
const {UserRepo} = require('./user_repo');
const userModel = require('./user');

const userRepo = new UserRepo(userModel);
const userService = new UserService(userRepo);

exports.addUser = async (req, res, next) => {
    try{
        const response = await userService.addUser(req);
        res.statusCode = response.status;

        return res.json({message: response.message, data: res.data});
    }catch(err){
        next(err);
    }
};