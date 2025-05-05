import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserResponseDto } from 'src/core/users/dto/user-response.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<UserResponseDto> {
        const userResponseDto = await this.authService.validateUser(username, password);

        if (!userResponseDto) {
            throw new UnauthorizedException();
        }

        return userResponseDto;
    }
}