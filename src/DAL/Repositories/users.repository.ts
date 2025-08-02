import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GenericRepository } from './generics/BaseRepository';
import { User } from '../Entities/user.entity';

@Injectable()
export class UsersRepository extends GenericRepository<User> {
  constructor(dataSource: DataSource) {
    super(dataSource, User);
  }
}