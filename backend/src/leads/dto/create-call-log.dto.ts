import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCallLogDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  agentId: number;
}
