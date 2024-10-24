import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from "@nestjs/mongoose";
import { PrivateKeyModule } from './private-key/private-key.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://user:vQTkYnPSRVIkD0GJ@cluster0.spmviz0.mongodb.net/dbname?retryWrites=true&w=majority`,
      { dbName: 'cupsharing' },
    ),
    AuthModule,
    SubscriptionModule,
    UserModule,
    PrivateKeyModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
