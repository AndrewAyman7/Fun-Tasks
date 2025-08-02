import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users.module';
import { EventsController } from 'src/Web/controllers/events.controller';
import { EventsService } from 'src/BL/Event/service/events.service';
import { EventsRepository } from 'src/DAL/Repositories/events.repository';
import { ScheduledEvent } from 'src/DAL/Entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduledEvent]),
    UsersModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
   exports: [EventsRepository],
})
export class EventsModule {}