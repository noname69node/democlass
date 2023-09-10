import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import logger from "../utils/logger";

function errorMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const name = err.name;

  logger.error(err.message);
  console.log("ErrorHandler");
  res.status(status).json({ name, message });
}

export default errorMiddleware;
