class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }

  // Generic creator (useful for any code)
  static custom(statusCode: number, message: string): ApiError {
    return new ApiError(statusCode, message);
  }

  // 4xx Client Errors
  static badRequest(message = "Bad Request"): ApiError {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Unauthorized"): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden"): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = "Not Found"): ApiError {
    return new ApiError(404, message);
  }

  static methodNotAllowed(message = "Method Not Allowed"): ApiError {
    return new ApiError(405, message);
  }

  static conflict(message = "Conflict"): ApiError {
    return new ApiError(409, message);
  }

  static unprocessableEntity(message = "Unprocessable Entity"): ApiError {
    return new ApiError(422, message);
  }

  static tooManyRequests(message = "Too Many Requests"): ApiError {
    return new ApiError(429, message);
  }

  // 5xx Server Errors
  static internal(message = "Internal Server Error"): ApiError {
    return new ApiError(500, message);
  }

  static notImplemented(message = "Not Implemented"): ApiError {
    return new ApiError(501, message);
  }

  static badGateway(message = "Bad Gateway"): ApiError {
    return new ApiError(502, message);
  }

  static serviceUnavailable(message = "Service Unavailable"): ApiError {
    return new ApiError(503, message);
  }
}

export default ApiError;
