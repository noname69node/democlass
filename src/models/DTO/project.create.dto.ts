import {
  IsEnum,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  Validate,
} from "class-validator";
import { Trim, ToDate } from "class-sanitizer";
import { ProjectStatus } from "../project.model";

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import mongoose from "mongoose";

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
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array of valid MongoDB ObjectIds.`;
  }
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

  //work with date
  @ToDate()
  @IsDate()
  @IsOptional()
  public start_date?: Date;

  @ToDate()
  @IsDate()
  @IsOptional()
  public end_date?: Date;

  @ToDate()
  @IsDate()
  @IsOptional()
  public deadline?: Date;

  @IsString()
  @IsOptional()
  @Validate(IsValidMongoIdConstraint, { message: "Invalid project manager ID" })
  public project_manager?: string;

  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  @Validate(IsValidMongoIdArrayConstraint, { message: "Invalid workers array" })
  public workers?: string[];
}
