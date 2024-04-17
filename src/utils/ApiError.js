class ApiError extends Error {
  constructor(status, message, data = null, stack) {
    super(message);
    (status = this.status),
      (stack = this.stack),
      (message = this.message),
      (data = this.data);

    if (!stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
