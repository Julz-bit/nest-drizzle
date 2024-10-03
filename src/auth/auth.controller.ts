import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Bcrypt } from 'utils/bcrypt';

@ApiTags('Auth Service')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('signin')
    async signin(@Body() body: AuthDto) {
        return await this.authService.signIn(body)
    }

    @Get('test')
    async test() {
        return await Bcrypt.hash('asdqwe13')
    }
}
