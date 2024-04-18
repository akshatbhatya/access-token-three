class ApiResponse {
  constructor(status, message, data,success) {
    (status = this.status),
      (message = this.message),
      (data = this.data),
      (success = status < 400);
  }
}

export default ApiResponse;
