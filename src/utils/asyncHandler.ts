import { Request, Response, NextFunction } from "express";

export type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (handler: ExpressHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
