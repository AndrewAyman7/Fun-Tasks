import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/BL/User/service/users.service';
import { User } from 'src/DAL/Entities/user.entity';
import { UsersRepository } from 'src/DAL/Repositories/users.repository';
import { UsersController } from 'src/Web/controllers/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}