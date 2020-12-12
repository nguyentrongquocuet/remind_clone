class SystemError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.code = statusCode;
  }
}

module.exports = SystemError;
