import { Request, Response, Router } from "express";
import { MongooseError, Types, isValidObjectId } from "mongoose";
import { IController } from "../interfaces/IController";
import logger from "../utils/logger";
import mongoose from "mongoose";

import validationMiddleware from "../middleware/validation.middleware";
import { CreateProjectDto } from "../models/DTO/project.create.dto";
import ProjectModel from "../models/project.model";
import NotFoundException from "../exceptions/NotFoundException";

import { asyncHandler } from "../utils/asyncHandler";

class ProjectController implements IController {
  public path = "/projects";
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get(this.path, this.getProjects);
    this.router.get(`${this.path}/:id`, this.getProject);
    this.router.post(this.path, validationMiddleware(CreateProjectDto), this.createProject);
    this.router.patch(`${this.path}/:id`, this.updateProject);
    this.router.delete(`${this.path}/:id`, this.deleteProject);
  }

  public getProjects = (req: Request, res: Response) => {
    res.json({ message: "get all projects" });
  };

  public getProject = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) throw new MongooseError("invalid id");

    const project = await ProjectModel.findById(id).populate([
      {
        path: "project_manager",
        model: "User",
        select: "fullname",
      },
      {
        path: "workers",
        model: "User",
        select: "fullname",
      },
    ]);

    // const project = await ProjectModel.aggregate([
    //   {
    //     $match: { _id: new mongoose.Types.ObjectId(id) },
    //   },
    //   {
    //     $lookup: {
    //       from: "users", // Replace with the actual name of your User collection
    //       localField: "workers.wid",
    //       foreignField: "_id",
    //       as: "workersData",
    //     },
    //   },
    //   {
    //     $unwind: "$workersData",
    //   },
    //   {
    //     $addFields: {
    //       "workers.fullname": "$workersData.fullname",
    //     },
    //   },
    //   {
    //     $project: {
    //       workersData: 0,
    //     },
    //   },
    // ]);

    console.log(project);

    res.json(project);
  });

  public createProject = async (req: Request, res: Response) => {
    const newProject = req.body;
    try {
      const createdProject = await ProjectModel.create(newProject);
      console.log(createdProject);
      res.json(createdProject);
    } catch (error: any) {
      logger.error(error);
      return res.status(409).send(error.message);
    }
  };

  public updateProject = (req: Request, res: Response) => {
    const id = req.params.id;
    const project = req.body;
    res.json({ message: `update project ${id}`, project });
  };

  public deleteProject = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) throw new MongooseError("invalid id");

    const deletedProject = await ProjectModel.findByIdAndDelete(id);
    if (!deletedProject) throw new NotFoundException("Project", id);

    res.json({ message: `User with ${id}} deleted` });
  });
}

export default ProjectController;
