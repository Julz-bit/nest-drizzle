import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { Bcrypt } from '../common/utils/bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) { }

    async signIn(authDto: AuthDto) {
        const user = await this.usersService.findByEmail(authDto.email)
        if (!user || !(await Bcrypt.compare(authDto.password, user.password))) throw new BadRequestException('Invalid Credentials');
        const { id, createdAt, ...rest } = user
        const payload = { sub: id, ...rest }
        return await this.jwtService.signAsync(payload)
    }

    async authenticated() {
        return true
    }
}
