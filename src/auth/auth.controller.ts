import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Bcrypt } from '../common/utils/bcrypt';
import { AuthGuard } from './auth.guard';
import { FastifyRequest } from 'fastify';

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

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get()
    authenticated(@Request() req: FastifyRequest) {
        console.log(req.user)
        return this.authService.authenticated()
    }
}
