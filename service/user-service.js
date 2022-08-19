const UserModel = require('../models/User-model');
const bcrypt  = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const Apierror = require('../exceptions/api-error');

class UserService {
  async registration(email, password, name) {
    const candidate = await UserModel.findOne({email})
  
    if(candidate) {
      throw  Apierror.BadRequestError("this email is already registered");
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await UserModel.create({email: email, password: hashPassword,name:name,activationLink})
    const userDto = await new UserDto(user); //id, email, isActivated

    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      token:tokens,
      user:userDto
    }
  }

  async updateUser(refreshToken,name,email,newPassword,oldPassword) {
    const user = await UserModel.findOne({email});

    const isPassEqual = await bcrypt.compare(oldPassword, user.password);
    if(!isPassEqual) {
      throw Apierror.BadRequestError("Invalid password")
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if(!tokenFromDb || !userData) {
      throw Apierror.UnavthorizedError();
    }

    const hashPassword = await bcrypt.hash(newPassword, 3);

    const updatedUser = await UserModel.findOneAndUpdate({email:email},
      { $set:{password: hashPassword,name:name}},
      { returnOriginal: false })
      
    const userDto = new UserDto(updatedUser)
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
 
    return {
      token:tokens,
      user:userDto
    }
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink})
    if(!user) throw Apierror.BadRequestError("Couldn't find activation!")
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({email});
    if(!user) throw  Apierror.BadRequestError("user is not logged in!");

    const isPassEqual = await bcrypt.compare(password, user.password);
    if(!isPassEqual) {
      throw Apierror.BadRequestError("Invalid password")
    }

    const userDto = new UserDto(user);
    const token = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, token.refreshToken);
    return {token:token,user:userDto}
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return {token};
  }

  async refreshToken(refreshToken) {
    if(!refreshToken) {
      throw Apierror.UnavthorizedError("Invalid refresh token")
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if(!tokenFromDb || !userData) {
      throw Apierror.UnavthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = await new UserDto(user);
    const token = await tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id, token.refreshToken);

    return {token:token,user:userDto}
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async getUser(email) {
    const user = await UserModel.findOne({email});
    
    return {email:user.email,name:user.name,id:user.id};
  }

  async delete(email,password, refreshToken) {
    const user = await UserModel.findOne({email})

    if(!user) {
      throw Apierror.BadRequestError("email is not found")
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if(!isPassEqual) {
      throw Apierror.BadRequestError("Invalid password")
    }

    await UserModel.deleteOne({email});
    await tokenService.removeToken(refreshToken);
  }

  async getUserById(id) {
    const user = await UserModel.findById(id);
    if(!user) {
      throw Apierror.BadRequestError("user is not found")
    }
    return user;
  }
}

module.exports = new UserService();