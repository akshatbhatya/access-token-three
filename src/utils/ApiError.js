class ApiError extends Error {
  constructor(status, message, data = null, stack) {
    super(message);
    (this.status = status),
      (this.stack=stack),
      (this.message=message),
      (this.data=data);

    if (!stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
