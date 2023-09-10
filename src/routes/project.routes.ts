import { Router } from "express";

import ProjectController from "../controllers/ProjectController";
import { CreateProjectDto } from "../models/DTO/project.create.dto";

import validationMiddleware from "../middleware/validation.middleware";

class ProjectRoutes {
  public router = Router();
  public path = "/projects";
  private controller = new ProjectController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(this.path, this.controller.getProjects);
    this.router.get(`${this.path}/:id`, this.controller.getProject);
    this.router.post(this.path, validationMiddleware(CreateProjectDto), this.controller.createProject);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreateProjectDto, true), this.controller.updateProject);
    this.router.delete(`${this.path}/:id`, this.controller.deleteProject);
  }
}

export default new ProjectRoutes().router;