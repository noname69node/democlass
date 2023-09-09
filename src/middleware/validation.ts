import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import { sanitize } from 'class-sanitizer';
//import HttpException from '../exceptions/HttpException';

function validationMiddleware<T>(type: any): express.RequestHandler {
  return (req, res, next) => {
    const dtoObj = plainToInstance(type, req.body);
    validate(dtoObj).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error) =>
          Object.values(error.constraints!).toString()
        );

        res.json({ error: message });
        next(new Error(message.toString()));
      } else {
        sanitize(dtoObj);
        req.body = dtoObj;
        next();
      }
    });
  };
}

export default validationMiddleware;
