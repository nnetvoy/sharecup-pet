import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {

  @ApiProperty({example: 'example@example.com', description: 'Email'})
  readonly email: string;

  @ApiProperty({example: '********', description: 'Пароль'})
  readonly password: string;

  @ApiProperty({example: 'Ростислав', description: 'Имя'})
  readonly firstName: string;

  @ApiProperty({example: 'Архипов', description: 'Фамилия'})
  readonly lastName: string;

  @ApiProperty({example: false, description: 'Признак компании'})
  readonly company: boolean;

  @ApiProperty({example: '583185141636', description: 'ИНН компании'})
  readonly companyInn: string | null;

  @ApiProperty({example: '123123123', description: 'ОГРН или ОГРНИП компании или ИП'})
  readonly companyOgrn: string | null;

  @ApiProperty({example: '123123123', description: 'КПП компании'})
  readonly companyKpp: string | null;

  @ApiProperty({example: 'г. Санкт-Петербург, ул. Выборгская, д.1 ', description: 'Адрес компании'})
  readonly companyAddress: string | null;

  @ApiProperty({example: 'Капибара', description: 'Наименование компании или кафе'})
  readonly companyName: string | null;

}
