class HttpException extends Error {
  name: string;
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpException";
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
