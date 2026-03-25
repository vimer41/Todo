import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
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

  @IsOptional()
  @IsDate()
  completed_at?: Date | null;

  @IsNotEmpty()
  @MinLength(1)
  @IsUUID()
  userId: string;
}