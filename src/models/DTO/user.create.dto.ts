import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  NotContains,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { Trim, ToDate, NormalizeEmail } from 'class-sanitizer';
import { UserRole, UserStatus } from '../User/user.enums';

class CreateUserDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  public fullname: string;

  @Trim()
  @NormalizeEmail()
  @IsEmail({}, { message: 'Provided Email is not valid' })
  public email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter and one number',
  })
  @NotContains(' ', {
    message: 'Password must not contain whitespace characters',
  })
  public password: string;

  @IsString()
  @IsEnum(UserRole)
  public role: UserRole;

  // check date better, range check
  @ToDate()
  @IsDate()
  public date_of_birth?: Date;

  @IsString()
  @IsOptional()
  public profile_img?: string;

  @IsString()
  @IsEnum(UserStatus)
  public status: UserStatus;

  @IsString()
  @IsOptional()
  public token: string;
}

export default CreateUserDto;
