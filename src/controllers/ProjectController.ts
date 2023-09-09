import { Request, Response, Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { IController } from '../interfaces/IController';
import logger from '../utils/logger';
import mongoose from 'mongoose';

class ProjectController implements IController {
  public path = '/projects';
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getProjects);
    this.router.get(`${this.path}/:id`, this.getProject);
    this.router.post(this.path, this.createProject);
    this.router.patch(`${this.path}/:id`, this.updateProject);
    this.router.delete(`${this.path}/:id`, this.deleteProject);
  }

  private getProjects = (req: Request, res: Response) => {
    res.json({ message: 'get all projects' });
  };

  private getProject = (req: Request, res: Response) => {
    const id = req.params.id;
    res.json({ message: `get project ${id}` });
  };

  private createProject = (req: Request, res: Response) => {
    const project = req.body;
    try {
    } catch (error: any) {
      logger.error(error);
      return res.status(409).send(error.message);
    }
  };

  private updateProject = (req: Request, res: Response) => {
    const id = req.params.id;
    const project = req.body;
    res.json({ message: `update project ${id}`, project });
  };

  private deleteProject = (req: Request, res: Response) => {
    const id = req.params.id;
    res.json({ message: `delete project ${id}` });
  };
}

export default ProjectController;
