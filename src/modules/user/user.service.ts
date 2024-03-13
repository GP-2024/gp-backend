import { Injectable, NotFoundException } from '@nestjs/common';
import { UserLogin } from './entities/user-login-data.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { updateDtoUser } from './_helpers/updateDto';
import { UserAccount } from './entities/user-account.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserLogin)
    private readonly userLoginRepository: Repository<UserLogin>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
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

  async createUserLoginData(userData: Partial<UserLogin>): Promise<UserLogin> {
    updateDtoUser(userData);
    const userLogin = this.userLoginRepository.create(userData);
    console.log(userLogin);
    return await this.userLoginRepository.save(userLogin);
  }

  async createUserAccount(userAccount: Partial<UserAccount>): Promise<UserAccount> {
    const userLoginAccount = this.userAccountRepository.create(userAccount);
    console.log(userLoginAccount);
    return await this.userAccountRepository.save(userLoginAccount);
  }
}
