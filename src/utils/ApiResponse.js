class ApiResponse {
  constructor(status, message, data) {
    (status = this.status),
      (message = this.message),
      (data = this.data),
      (success = status < 400);
  }
}

export default ApiResponse;
