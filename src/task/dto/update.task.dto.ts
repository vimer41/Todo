import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTaskDTO {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsOptional()
  @MinLength(1)
  @MaxLength(1000)
  description?: string;

  @IsNotEmpty()
  completed: boolean;
}
