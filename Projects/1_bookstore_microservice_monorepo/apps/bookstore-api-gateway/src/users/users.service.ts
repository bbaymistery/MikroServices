import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_CLIENT } from './constant';

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_CLIENT) private readonly usersClient: ClientProxy) {}

  async findAll() {
    return this.usersClient.send('users.findAll', {});
  }
}
