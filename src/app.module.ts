import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './Modules/events.module';
import { UsersModule } from './Modules/users.module';
import { databaseConfig } from './DAL/Data/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    EventsModule,
    UsersModule,
  ]
})
export class AppModule {}
