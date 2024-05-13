import { ClientError } from "./ClientError";

export class AuthError extends ClientError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'AuthError';
  }
}