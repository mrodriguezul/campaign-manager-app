import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCallLogDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'The status of the Phone Call'})
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({description: 'The notes made by the Agent on the Phone Call'})
  notes?: string;
}
