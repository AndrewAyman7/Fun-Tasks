import { Injectable } from '@nestjs/common';
import { User } from 'src/DAL/Entities/user.entity';
import { UsersRepository } from 'src/DAL/Repositories/users.repository';
import { FindManyOptions } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';


@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * @description Checks if a user exists
   * @param findOptions - Query options to find user
   * @returns Boolean indicating user existence
   */
  async exists(findOptions: FindManyOptions<User>): Promise<boolean> {
    return this.usersRepository.exists(findOptions);
  }


  async createUser(dto: CreateUserDto): Promise<{ id: string }> {
    const user = await this.usersRepository.createOne({ name: dto.name });
    return { id: user.id };
  }
  
}