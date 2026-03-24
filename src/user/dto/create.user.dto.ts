import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  full_name: string;

  @IsOptional()
  @MinLength(10)
  @MaxLength(15)
  @Matches(/^\+/, {message: "Must start with +"})
  telephone?: string;
}