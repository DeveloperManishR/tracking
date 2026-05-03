import { type Response } from "express";

type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T | null;
};

class ApiResponse {
  // 200 OK
  static ok<T = any>(
    res: Response,
    message: string = "Success",
    data: T | null = null
  ): Response<ApiSuccess<T>> {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  // 201 Created
  static created<T = any>(
    res: Response,
    message: string = "Resource created",
    data: T | null = null
  ): Response<ApiSuccess<T>> {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  // 202 Accepted (useful for async jobs)
  static accepted<T = any>(
    res: Response,
    message: string = "Request accepted",
    data: T | null = null
  ): Response<ApiSuccess<T>> {
    return res.status(202).json({
      success: true,
      message,
      data,
    });
  }

  // 204 No Content
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  // Flexible success handler (covers all 2xx cases)
  static success<T = any>(
    res: Response,
    statusCode: number = 200,
    message: string = "Success",
    data: T | null = null
  ): Response<ApiSuccess<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
}

export default ApiResponse;