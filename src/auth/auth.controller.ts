import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from './auth.guard';
import { Auth } from '../common/decorators/auth.decorator';
import { SerializeInterceptor } from '../common/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { User } from '../common/types/model';
import { AuthDto } from './dto/auth.dto';
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

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Roles(Role.User)
    @UseInterceptors(new SerializeInterceptor(['iat', 'exp', 'sub']))
    authenticated(@Auth() user: User) {
        return user;
    }
}
