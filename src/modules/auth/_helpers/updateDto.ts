import { AuthDto } from "../dto/auth.dto";
import { userAccountData, userLoginData } from "../types";

function updateDtoAuth(hashPassword: string, signUpData: AuthDto): void {
    signUpData.passwordHash = hashPassword;
    delete signUpData.password;
}


function separateObjects(signUpData: AuthDto): [userLoginData, userAccountData] {
    const userCredential: userLoginData = {
        username: signUpData.username,
        email: signUpData.email,
        passwordHash: signUpData.passwordHash,
    };

    const validateGender = (gender: string): "MALE" | "FEMALE" => {
        if (gender === "MALE" || gender === "FEMALE") {
            return gender as "MALE" | "FEMALE";
        } else {
            throw new Error("Invalid gender");
        }
    };

    const userAccountData: userAccountData = {
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        dateOfBirth: signUpData.dateOfBirth,
        joiningDate: new Date(),
        gender: validateGender(signUpData.gender),
    };
    return [userCredential, userAccountData];
}


export const updateDTO = { updateDtoAuth, separateObjects };