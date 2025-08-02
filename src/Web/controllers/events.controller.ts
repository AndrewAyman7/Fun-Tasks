import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEventDto } from 'src/BL/Event/dtos/create-event.dto';
import { EventsService } from 'src/BL/Event/service/events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * @description Schedules a new event for a user
   * @param createEventDto - Event details including userId, name, and executeAt
   * @returns Created event object
   * @throws HttpException if user not found or invalid input
   */
  @Post('schedule')
  async scheduleEvent(@Body() createEventDto: CreateEventDto) {
    try {
      return await this.eventsService.scheduleEvent(createEventDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * @description Retrieves all events for a specific user
   * @param userId - UUID of the user
   * @returns Array of user's events with status
   * @throws HttpException if user not found or no events exist
   */
  @Get('/users/:userId')
  async getUserEvents(@Param('userId') userId: string) {
    try {
      return await this.eventsService.getUserEvents(userId);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}