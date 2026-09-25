import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @ApiProperty({description: 'Email of the Agent', example: "example@gmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({description: 'Password of the Agent', example: "12345678"})
    @IsString()
    @IsNotEmpty()
    password: string;
}