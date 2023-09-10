import {
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  Validate,
  IsObject,
  isArray,
} from "class-validator";
import { Trim, ToDate } from "class-sanitizer";
import { ProjectStatus, WorkerStatusAtProject } from "../project.model";

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import mongoose from "mongoose";

@ValidatorConstraint({ name: "isValidDateRange", async: false })
export class IsValidDateRangeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!(value instanceof Date)) {
      return false; // Value is not a Date object
    }
    const year = value.getFullYear();
    return year >= 2000 && year <= 2050;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid date between 2000 and 2050.`;
  }
}

@ValidatorConstraint({ name: "isValidMongoId", async: false })
export class IsValidMongoIdConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return mongoose.Types.ObjectId.isValid(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid MongoDB ObjectId.`;
  }
}

@ValidatorConstraint({ name: "isValidMongoIdArray", async: false })
export class IsValidMongoIdArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any[], args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return false;
    }
    for (const item of value) {
      if (!mongoose.Types.ObjectId.isValid(item)) {
        // item.wid
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array of valid MongoDB ObjectIds.`;
  }
}

export class WorkerDto {
  @Validate(IsValidMongoIdConstraint, { message: "Invalid worker ID" })
  wid: string;

  @IsEnum(WorkerStatusAtProject)
  @IsOptional()
  status?: WorkerStatusAtProject;
}

export class CreateProjectDto {
  @Trim()
  @IsString()
  @IsNotEmpty({ message: "Project name is required" })
  public name: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsEnum(ProjectStatus, { message: "Invalid project status" })
  public status: ProjectStatus = ProjectStatus.Planning;

  // validation for location

  //validation for date, date range
  @ToDate()
  @IsDate({ message: "Invalid start date" })
  @IsOptional()
  @Validate(IsValidDateRangeConstraint, { message: "Invalid start date range" })
  public start_date?: Date;

  @ToDate()
  @IsDate({ message: "Invalid end date" })
  @IsOptional()
  @Validate(IsValidDateRangeConstraint, { message: "Invalid end date range" })
  public end_date?: Date;

  @ToDate()
  @IsDate({ message: "Invalid deadline date" })
  @IsOptional()
  @Validate(IsValidDateRangeConstraint, { message: "Invalid deadline range" })
  public deadline?: Date;

  @IsString()
  @IsOptional()
  @Validate(IsValidMongoIdConstraint, { message: "Invalid project manager ID" })
  public project_manager?: string;

  //@IsObject({ each: true })
  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  @Validate(IsValidMongoIdArrayConstraint, {
    message: "Invalid workers array, or invalid one of worker ID",
  })
  //   public workers?: WorkerDto[];
  public workers?: string[];
}
