import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/BL/User/dtos/create-user.dto';
import { UsersService } from 'src/BL/User/service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<{ id: string }> {
    return this.usersService.createUser(createUserDto);
  }
}
