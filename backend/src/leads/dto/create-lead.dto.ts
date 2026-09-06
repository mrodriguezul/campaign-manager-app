import { IsString, IsNotEmpty, IsPhoneNumber, IsEnum } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  context: string;
}
