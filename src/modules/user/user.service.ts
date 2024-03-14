import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userAccountRepository: Repository<Users>,
  ) {}

  async findOne(id: string) {
    const user = await this.userAccountRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { data: user };
  }

  // TODO: pagenation and filter
  async findAll() {
    const users = await this.userAccountRepository.findAndCount({});
    return { data: users[0], total: users[1] };
  }


  async createUserAccount(userAccount: Partial<Users>): Promise<Users> {
    const userLoginAccount = this.userAccountRepository.create(userAccount);
    return await this.userAccountRepository.save(userLoginAccount);
  }
}
