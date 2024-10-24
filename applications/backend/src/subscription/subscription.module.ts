import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { Subscription, SubscriptionSchema } from "./models/subscription.model";
import { Cups, CupsSchema } from "./models/cups.model";
import { PrivateKeyModule } from "../private-key/private-key.module";

@Module({
  imports: [
    JwtModule.register({
      secret: 'jashudIHA7w8RHQ@&#RHQ@R',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Cups.name, schema: CupsSchema },
    ]),
    UserModule,
    PrivateKeyModule
  ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {}
