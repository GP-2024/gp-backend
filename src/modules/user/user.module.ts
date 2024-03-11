import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserLogin } from "./entities/user-login-data.entity";
import { UserAccount } from "./entities/user-account.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserLogin, UserAccount])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
}
