const jwt = require('jsonwebtoken');
const TokenModel = require('../models/token-model')

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN,{expiresIn:'30m'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN,{expiresIn:'300d'}); 
    
    return { accessToken, refreshToken }
  }

  validateAccessToken(accessToken) {
    try {
      const UserData = jwt.verify(accessToken,process.env.JWT_ACCESS_TOKEN)
      return UserData;
    }
    catch (e) {
      return null;
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const UserData = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
      return UserData;
    }
    catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({user:userId.toString()});

    if(tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({user:userId,refreshToken});
    TokenModel.findOne({refreshToken:refreshToken}).
    populate('User').
    exec(function (err, story) {
      if (err) return err;
      // prints "The author is Ian Fleming"
    });
    return token;
  }

  async removeToken(refreshToken) {
      const tokenData = await TokenModel.findOneAndDelete({refreshToken});
      return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await TokenModel.findOne({refreshToken});
    return tokenData; 
}
}

module.exports = new TokenService();