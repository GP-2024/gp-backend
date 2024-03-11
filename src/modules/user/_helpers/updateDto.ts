import { UserLogin } from "../entities/user-login-data.entity";
export function updateDtoUser(userData: Partial<UserLogin>): void {
    userData.createdAt = new Date();
    userData.updatedAt = new Date();
}
