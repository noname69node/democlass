import HttpException from "./HttpException";

class ValidationException extends HttpException {
  constructor(text: string) {
    const statusCode = 409;
    const message = text;
    super(statusCode, message);
    this.name = "ValidationException";
  }
}

export default ValidationException;
