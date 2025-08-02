import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from '../dtos/create-event.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventsRepository } from 'src/DAL/Repositories/events.repository';
import { UsersService } from '../../User/service/users.service';
import { ScheduledEvent } from 'src/DAL/Entities/event.entity';
import { EventStatusEnum } from 'src/Shared/Enums/EventStatus.enum';
import { DeepPartial, LessThanOrEqual } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly usersService: UsersService,
  ) {}

  
  /**
   * @description Schedules a new event after validating input
   * @param createEventDto - Event details including userId, name, and executeAt
   * @returns Created event
   * @throws NotFoundException if user not found
   */
  async scheduleEvent(createEventDto: CreateEventDto): Promise<ScheduledEvent> {
    const userExists = await this.usersService.exists({ where: { id: createEventDto.userId } });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    return this.eventsRepository.createOne({
      ...createEventDto,
      status: EventStatusEnum.PENDING,
      executedAt: null,
    } as DeepPartial<ScheduledEvent>);
  }


  /**
   * @description Retrieves all events for a user
   * @param userId - UUID of the user
   * @returns Object containing array of events and total count
   * @throws NotFoundException if user not found or no events exist
   */
  async getUserEvents(userId: string): Promise<{ results: ScheduledEvent[]; totalCount: number }> {
    const userExists = await this.usersService.exists({ where: { id: userId } });
    if (!userExists) throw new NotFoundException('User not found');

    const result = await this.eventsRepository.findMany({
      where: { userId },
      order: { executeAt: 'ASC' },
    });

    if (result.results.length === 0) {
      throw new NotFoundException('No events found for user');
    }

    return result;
  }


  /**
   * @description Processes pending events that are due every minute
   * @returns void
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async processPendingEvents() {
    const now = new Date();
    const pendingEvents = await this.eventsRepository.findMany({
      where: {
        status: EventStatusEnum.PENDING,
        executeAt: LessThanOrEqual(now),
      },
    });

    for (const event of pendingEvents.results) {
      try {
        const updated = await this.eventsRepository.updateOne(
          { id: event.id },
          { status: EventStatusEnum.EXECUTED, executedAt: now },
        );
        if (!updated) {
          throw new InternalServerErrorException(`Failed to update event ${event.id}`);
        }
      } catch (error) {
        throw new InternalServerErrorException(`Failed to update event ${event.id}`);
      }
    }
  }
}