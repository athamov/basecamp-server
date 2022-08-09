module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, messages, errors=[]) {
    super(messages);
    this.status = status;
    this.errors = errors;
  }

  static UnavthorizedError() {
    return new ApiError(401, 'unavthorized user');
  }

  static BadRequestError(message, errors=[]) {
    return new ApiError(400, message, errors);
  }  
}