import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {

  @ApiProperty({example: 'example@example.com', description: 'Email'})
  readonly email: string;

  @ApiProperty({example: '********', description: 'Пароль'})
  readonly password: string;
}
