import HttpException from "./HttpException";

class ConflictException extends HttpException {
  constructor(text: string) {
    const statusCode = 409;
    const message = text;
    super(statusCode, message);
    this.name = "ConflictException";
  }
}

export default ConflictException;
