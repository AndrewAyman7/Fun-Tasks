import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GenericRepository } from './generics/BaseRepository';
import { ScheduledEvent } from '../Entities/event.entity';

@Injectable()
export class EventsRepository extends GenericRepository<ScheduledEvent> {
  constructor(dataSource: DataSource) {
    super(dataSource, ScheduledEvent);
  }
}