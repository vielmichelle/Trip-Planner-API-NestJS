import { Controller, Post, UseGuards, Request, UseInterceptors, SerializeOptions, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { Public } from './decorators/public.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { plainToInstance } from 'class-transformer';
import { defaultSerializeOptions } from 'src/common/utils/serialize.utils';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    /**
     * Login with a valid user to retrieve the access token
     */
    @Public()
    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginRequestDto })
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions(defaultSerializeOptions)
    @ApiCreatedResponse({ type: LoginResponseDto })
    @ApiResponse({ status: 400, description: "Validation Error" })
    login(@Request() req: any): LoginResponseDto {
        return plainToInstance(LoginResponseDto, this.authService.login(req.user));
    }
}
