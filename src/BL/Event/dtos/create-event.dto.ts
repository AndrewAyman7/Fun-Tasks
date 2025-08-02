import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  name: string;

  @IsISO8601()
  @IsNotEmpty()
  executeAt: string;
}