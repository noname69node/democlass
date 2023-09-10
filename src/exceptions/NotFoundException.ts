import HttpException from "./HttpException";

class NotFoundException extends HttpException {
  constructor(text?: string, id?: string) {
    const statusCode = text && id ? 404 : 404;
    const message = text && id ? `${text} with ID ${id} not found` : `${text} not found`;
    super(statusCode, message);
    this.name = "NotFoundException";
  }
}

export default NotFoundException;
