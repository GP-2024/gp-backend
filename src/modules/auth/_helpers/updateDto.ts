import { AuthDto } from "../dto/auth.dto";

function updateDtoAuth(hashPassword: string, signUpData: AuthDto): void {
    signUpData.password = hashPassword;
}





export const updateDTO = { updateDtoAuth };