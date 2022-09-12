const userService = require("../service/user-service");
const {validationResult} = require('express-validator');
const tokenService = require("../service/token-service");
const ApiError = require('../exceptions/api-error');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequestError('validation error', errors.array()));
      }
      const {email, password, name} = req.body;
      const userData = await userService.registration(email, password, name);
      res.cookie('refreshToken',userData.token.refreshToken,{maxAge:2592000000,httpOnly:true})
      return res.json(userData);
    }
    catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const userData = await userService.login(email, password);
      res.cookie('refreshToken',userData.token.refreshToken,{maxAge:2592000000,httpOnly:true})
      return res.json(userData);
    }
    catch (err) {
      next(err);
      
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    }
    catch (err) {
      next(err);
      
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL)
    }
    catch (err) {
      next(err);

    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      if(refreshToken) return res.send('refreshToken is not available');
      const userData = await userService.refreshToken(refreshToken);
      res.cookie('refreshToken',userData.token.refreshToken,{maxAge:2592000000,httpOnly:true})
      return res.json(userData);
    }
    catch (err) {
      next(err);
    }
  }

  async sendAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers()
      res.json(users)
    }
    catch (err) {
      next(err);
    }
  }

  async sendUser(req, res, next) {
    try {
      const {refreshToken} = req.cookies;

      const token = await tokenService.findToken(refreshToken);

      const user = await userService.getUserById(token.User)
      res.json(user)
    }
    catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const { name, email, newPassword, oldPassword } = req.body;
      const userData = await userService.updateUser(refreshToken,name,email,newPassword,oldPassword);
      res.cookie('refreshToken',userData.token.refreshToken,{maxAge:2592000000,httpOnly:true})

      return res.json(userData)
    }
    catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const {email, password} = req.body;
      await userService.delete(email,password ,refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).send(true);
    }
    catch (err) {
      console.log(err);
    }
  }
}

module.exports = new UserController();