import { SignUpDto } from "../dto/sign-up.dto";

function updateDtoAuth(hashPassword: string, signUpData: SignUpDto): void {
    signUpData.password = hashPassword;
}





export const updateDTO = { updateDtoAuth };