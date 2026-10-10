import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto.js';

@Injectable()
export class UsersService {

  private users: UserDto[] = [
    { id: 1, name: 'John ', age: 25, lastname: 'Doe' },
    { id: 2, name: 'Jack ', age: 23, lastname: 'Smith' },
  ];

  findAll() {
    return this.users;
  }
}
