import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from "@nestjs/jwt";
import { User, UserSchema } from "./models/user.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    JwtModule.register({
      secret: 'jashudIHA7w8RHQ@&#RHQ@R',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [
    UserService,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ]
})
export class UserModule {}
