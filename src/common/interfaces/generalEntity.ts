import { IsDate, IsString } from "class-validator";
import {
    BaseEntity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";
import { IsUUID } from "@nestjs/class-validator";

export default abstract class GeneralEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID("4")
    id: string;

    @UpdateDateColumn({})
    @IsDate()
    updatedAt?: Date;

    @CreateDateColumn({})
    @IsDate()
    createdAt?: Date;

    @DeleteDateColumn({})
    @IsDate()
    deletedAt?: Date;

    @ManyToOne("Users")
    @JoinColumn({ name: "createdBy", referencedColumnName: "username" })
    @Index()
    @IsString()
    createdBy?: string;

    @ManyToOne("Users")
    @JoinColumn({ name: "updatedBy", referencedColumnName: "username" })
    @IsString()
    updatedBy?: string;

    @ManyToOne("Users")
    @JoinColumn({ name: "deletedBy", referencedColumnName: "username" })
    @IsString()
    deletedBy?: string;
}
