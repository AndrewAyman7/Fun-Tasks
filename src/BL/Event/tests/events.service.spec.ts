import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EventsService } from '../service/events.service';
import { EventsRepository } from 'src/DAL/Repositories/events.repository';
import { UsersService } from 'src/BL/User/service/users.service';
import { CreateEventDto } from '../dtos/create-event.dto';
import { EventStatusEnum } from 'src/Shared/Enums/EventStatus.enum';

describe('EventsService', () => {
  let service: EventsService;
  let eventsRepository: EventsRepository;
  let usersService: UsersService;

  const mockEventsRepository = {
    createOne: jest.fn(),
    findMany: jest.fn(),
    updateOne: jest.fn(),
  };

  const mockUsersService = {
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: EventsRepository, useValue: mockEventsRepository },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsRepository = module.get<EventsRepository>(EventsRepository);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('scheduleEvent', () => {
    it('should create an event and return its details', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Test Event',
        executeAt: '2025-08-03T03:08:00+03:00',
        userId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const mockEvent = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: createEventDto.name,
        executeAt: createEventDto.executeAt,
        status: EventStatusEnum.PENDING,
        executedAt: null,
        userId: createEventDto.userId,
      };
      mockUsersService.exists.mockResolvedValue(true);
      mockEventsRepository.createOne.mockResolvedValue(mockEvent);

      const result = await service.scheduleEvent(createEventDto);

      expect(mockUsersService.exists).toHaveBeenCalledWith({ where: { id: createEventDto.userId } });
      expect(mockEventsRepository.createOne).toHaveBeenCalledWith({
        name: createEventDto.name,
        executeAt: createEventDto.executeAt,
        status: EventStatusEnum.PENDING,
        userId: createEventDto.userId,
        executedAt: null, 
      });
      expect(result).toEqual(mockEvent);
    });
  });

  describe('getUserEvents', () => {
    it('should return events for a user', async () => {
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      const mockEvents = {
        results: [
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Test Event',
            executeAt: '2025-08-03T03:08:00+03:00',
            status: EventStatusEnum.PENDING,
            executedAt: null,
            userId,
          },
        ],
        totalCount: 1,
      };
      mockUsersService.exists.mockResolvedValue(true);
      mockEventsRepository.findMany.mockResolvedValue(mockEvents);

      const result = await service.getUserEvents(userId);

      expect(mockUsersService.exists).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockEventsRepository.findMany).toHaveBeenCalledWith({
        where: { userId },
        order: { executeAt: 'ASC' },
      });
      expect(result).toEqual(mockEvents);
    });
  });

  describe('processPendingEvents', () => {
    it('should update pending events to executed', async () => {
      const now = new Date('2025-08-03T00:09:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => now);
      const mockEvents = {
        results: [
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Test Event',
            executeAt: '2025-08-03T03:08:00+03:00',
            status: EventStatusEnum.PENDING,
            executedAt: null,
            userId: '550e8400-e29b-41d4-a716-446655440000',
          },
        ],
        totalCount: 1,
      };
      mockEventsRepository.findMany.mockResolvedValue(mockEvents);
      mockEventsRepository.updateOne.mockResolvedValue(true);

      await service.processPendingEvents();

      expect(mockEventsRepository.findMany).toHaveBeenCalledWith({
        where: {
          status: EventStatusEnum.PENDING,
          executeAt: expect.any(Object),
        },
      });
      expect(mockEventsRepository.updateOne).toHaveBeenCalledWith(
        { id: mockEvents.results[0].id },
        { status: EventStatusEnum.EXECUTED, executedAt: now },
      );
    });
  });
});