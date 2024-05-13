import { httpStatusCode } from "../utils/http/status_code";

export class ClientError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = httpStatusCode.badRequest) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}