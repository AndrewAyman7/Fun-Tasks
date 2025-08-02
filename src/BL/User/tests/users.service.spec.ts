import { Test, TestingModule } from '@nestjs/testing';
import { FindManyOptions } from 'typeorm';
import { UsersService } from '../service/users.service';
import { UsersRepository } from 'src/DAL/Repositories/users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { EventStatusEnum } from 'src/Shared/Enums/EventStatus.enum';
import { User } from 'src/DAL/Entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;

  const mockUsersRepository = {
    exists: jest.fn(),
    createOne: jest.fn(),
    findEventsByUserId: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return its id', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe' };
      const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'John Doe' };
      mockUsersRepository.createOne.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(mockUsersRepository.createOne).toHaveBeenCalledWith({ name: 'John Doe' });
      expect(result).toEqual({ id: '550e8400-e29b-41d4-a716-446655440000' });
    });
  });

  describe('exists', () => {
    it('should return true if user exists', async () => {
      const findOptions: FindManyOptions<User> = { where: { name: 'John Doe' } };
      mockUsersRepository.exists.mockResolvedValue(true);

      const result = await service.exists(findOptions);

      expect(mockUsersRepository.exists).toHaveBeenCalledWith(findOptions);
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      const findOptions: FindManyOptions<User> = { where: { name: 'Unknown' } };
      mockUsersRepository.exists.mockResolvedValue(false);

      const result = await service.exists(findOptions);

      expect(mockUsersRepository.exists).toHaveBeenCalledWith(findOptions);
      expect(result).toBe(false);
    });
  });


});
