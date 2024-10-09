import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { FastifyRequest } from 'fastify';
import { TestDto } from './dto/test.dto';

@ApiTags('Auth Service')
@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('signin')
    async signin(@Body() body: AuthDto) {
        return await this.authService.signIn(body)
    }

    @Post('test')
    async test(@Body() body: TestDto) {
        return 'validation success'
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get()
    authenticated(@Request() req: FastifyRequest) {
        console.log(req.user)
        return this.authService.authenticated()
    }
}
