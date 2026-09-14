import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsPhoneNumber, IsEnum } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Name of the Lead'})
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @ApiProperty({description: 'The phone number of the Lead'})
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'The context for the phone call'})
  context: string;
}
