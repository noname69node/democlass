import { IsDate, IsEmail, IsEnum, IsOptional, IsString, Length, MinLength } from "class-validator";
import { Trim } from "class-sanitizer";
import { Type } from "class-transformer";
import { UserRole, UserStatus } from "./user.enums";

export class CreateUserDto {
  @IsEmail({}, { message: "Provided Email is not valid" })
  @Trim()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  @Trim()
  public fullname: string;

  @IsString()
  @IsEnum(UserRole)
  public role: UserRole;

  @IsDate()
  @Type(() => Date)
  public date_of_birth?: Date;

  @IsString()
  @IsOptional()
  public profile_picture?: string;

  @IsString()
  @IsEnum(UserStatus)
  public status: UserStatus;

  @IsString()
  @IsOptional()
  public token: string;
}
