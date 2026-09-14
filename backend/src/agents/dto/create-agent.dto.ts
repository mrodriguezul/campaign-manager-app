import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateAgentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'The name of the Agent'})
    name: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'The email of the Agent'})
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty({description: 'The password of the Agent'})
    password: string;
}
