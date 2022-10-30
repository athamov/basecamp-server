const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
  try {
    const avtorizationHeader = req.headers.authorization;
    const accessToken = avtorizationHeader

    const userData = tokenService.validateRefreshToken(accessToken);
    // if(!accessToken || !avtorizationHeader || !userData) {
      if(!avtorizationHeader) {
      return next(new ApiError.UnavthorizedError());
    }
    req.user = userData;
    next();
  }
  catch(err) {
    console.log('auth-middleware error: ' + err)
  }
}