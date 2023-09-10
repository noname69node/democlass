import { Document, Schema, model } from "mongoose";
import { IContact } from "./user.model";

export enum ProjectStatus {
  Planning = "planning",
  InProgress = "inprogress",
  Complete = "complete",
  OnHold = "onhold",
  Canceled = "canceled",
}

export interface ILocation extends IContact {
  geo_location: {
    type: string;
    coordinates: [number, number];
  };
}

export interface IProject extends Document {
  name: string;
  description?: string;
  location?: ILocation;
  status: ProjectStatus;
  start_date?: Date;
  end_date?: Date;
  deadline?: Date;
  project_manager?: Schema.Types.ObjectId;
  workers?: Schema.Types.ObjectId[];
}

const locationSchema = new Schema<ILocation>({
  //   address: String,
  //   city: String,
  //   country: String,
  //   zip: String,
  //   phone_number: String,
  geo_location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: String,
    location: locationSchema,
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.Planning,
      required: true,
    },
    start_date: Date,
    end_date: Date,
    deadline: Date,
    project_manager: {
      type: Schema.Types.ObjectId,
      res: "User",
    },
    workers: [
      {
        type: Schema.Types.ObjectId,
        res: "User",
      },
    ],
  },
  { timestamps: true }
);

const ProjectModel = model<IProject>("Project", projectSchema);

export default ProjectModel;
