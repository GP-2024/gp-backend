import { IsString } from "class-validator";
import GeneralEntity from "src/interfaces/generalEntity";
import { Column, Entity, JoinColumn, OneToOne, Relation } from "typeorm";
import { UserAccount } from "./user-account.entity";

@Entity("user_login_data")
export class UserLogin extends GeneralEntity {
    @OneToOne("UserAccount")
    @JoinColumn({ name: "userAccountId", referencedColumnName: "id" })
    userAccount: Relation<UserAccount>;

    @Column({ type: "varchar", length: 15, unique: true })
    @IsString()
    username: string;

    @Column({ type: "varchar" })
    @IsString()
    passwordHash: string;

    @Column({ type: "varchar", unique: true })
    @IsString()
    email: string;
}
