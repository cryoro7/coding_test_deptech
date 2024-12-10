import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user/user.module';
import { PegawaiModule } from './user/pegawai/pegawai.module';
import databaseConfig from './database/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { CutiModule } from './cuti/cuti.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    PegawaiModule,
    AuthModule,
    ActivityLogModule,
    CutiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
