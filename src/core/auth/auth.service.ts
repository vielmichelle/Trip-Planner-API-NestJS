import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { TokenPayloadResponseDto } from './dto/token-payload-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { jwtConfiguration } from './constants';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<UserResponseDto | null> {
        const user = await this.usersService.findByUsername(username);

        if (user && await bcrypt.compare(password, user?.passwordHash)) {
            // Map user into dto response and removes sensitive data
            return plainToInstance(UserResponseDto, user);
        }

        return null;
    }

    login(user: UserResponseDto): LoginResponseDto {
        const tokenPayloadResponse: TokenPayloadResponseDto = {
            sub: user._id.toString(),
            username: user.username
        };

        return <LoginResponseDto>{
            access_token: this.jwtService.sign(
                tokenPayloadResponse,
                { secret: jwtConfiguration.secret }) // TODO: Needed for tests, remove this
        };
    }
}
