import { Router } from "express";

import UserController from "../controllers/UserController";
import CreateUserDto from "../models/DTO/user.create.dto";

import validationMiddleware from "../middleware/validation.middleware";

class UserRoutes {
  public router = Router();
  public path = "/users";
  private controller = new UserController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(this.path, this.controller.getUsers);
    this.router.get(`${this.path}/:id`, this.controller.getUser);
    this.router.post(this.path, validationMiddleware(CreateUserDto), this.controller.createUser);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreateUserDto, true), this.controller.updateUser);
    this.router.delete(`${this.path}/:id`, this.controller.deleteUser);
  }
}

export default new UserRoutes().router;
