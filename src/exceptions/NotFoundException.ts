import { httpStatusCode } from "../utils/http/status_code";
import { ClientError } from "./ClientError";


export class NotFoundException extends ClientError {
  constructor(message: string) {
    super(message, httpStatusCode.notFound);
    this.name = 'NotFoundException';
  }
}