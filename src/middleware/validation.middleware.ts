import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestHandler } from "express";
import { sanitize } from "class-sanitizer";
import ValidationException from "../exceptions/ValidationException";
//import HttpException from '../exceptions/HttpException';

function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
  return (req, res, next) => {
    const dtoBodyObj = plainToInstance(type, req.body);
    const dtoParamsObj = plainToInstance(type, req.params);
    sanitize(dtoBodyObj);
    validate(dtoBodyObj, { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error) => Object.values(error.constraints!).toString());
        //res.json({ error: message });
        next(new ValidationException(message.toString()));
      } else {
        req.body = dtoBodyObj;
        next();
      }
    });
  };
}

export default validationMiddleware;
