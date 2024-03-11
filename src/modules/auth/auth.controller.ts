import { Controller, Post, Body, HttpStatus, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() signUpData: AuthDto) {
        return this.authService.signUp(signUpData);
    }
}
