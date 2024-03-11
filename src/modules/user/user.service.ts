import { Injectable } from "@nestjs/common";
import { UserLogin } from "./entities/user-login-data.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { updateDtoUser } from "./_helpers/updateDto";
import { UserAccount } from "./entities/user-account.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserLogin)
        private readonly userLoginRepository: Repository<UserLogin>,
        @InjectRepository(UserAccount)
        private readonly userLoginAccountRepository: Repository<UserAccount>,
    ) {
    }

    async createUserLoginData(userData: Partial<UserLogin>): Promise<UserLogin> {
        updateDtoUser(userData);
        const userLogin = this.userLoginRepository.create(userData);
        console.log(userLogin);
        return await this.userLoginRepository.save(userLogin);
    }

    async createUserAccount(userAccount: Partial<UserAccount>): Promise<UserAccount> {
        const userLoginAccount = this.userLoginAccountRepository.create(userAccount);
        console.log(userLoginAccount);
        return await this.userLoginAccountRepository.save(userLoginAccount);
    }


}
