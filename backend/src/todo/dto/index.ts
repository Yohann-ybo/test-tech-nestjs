import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  MinLength,
} from "class-validator";

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string;

  @IsString()
  @MaxLength(256)
  content: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsOptional()
  @IsDateString()
  executionDate?: Date;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsDateString()
  executionDate?: Date | null;
}
