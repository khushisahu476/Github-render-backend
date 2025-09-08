const express = require("express");
const UserController = require('../controllers/userController.js');

const UserRouter = express.Router();

UserRouter.get('/allUsers',UserController.getAllUsers);
UserRouter.post('/signup',UserController.signup);
UserRouter.post('/login',UserController.login);
UserRouter.get('/userProfile/:id',UserController.getUserProfile);
UserRouter.put('/updateProfile/:id',UserController.updateUserProfile);
UserRouter.delete('/deleteProfile/:id',UserController.deleteUserProfile);

module.exports = {UserRouter};
