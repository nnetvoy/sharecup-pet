import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'jashudIHA7w8RHQ@&#RHQ@R',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
