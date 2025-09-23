import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  MinLength,
} from "class-validator";

export enum Priority {
  BAS = "BAS",
  MOYEN = "MOYEN",
  HAUT = "HAUT",
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
