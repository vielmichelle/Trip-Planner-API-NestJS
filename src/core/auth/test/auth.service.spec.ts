import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserResponseDto } from 'src/core/users/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { userStub } from 'src/core/users/test/stubs/users.stub';
import { userResponseDtoStub } from './stubs/auth-stubs';
import { jwtConfiguration, jwtConstants } from '../constants';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

jest.mock('../../users/users.service');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.registerAsync({
          useFactory: () => jwtConfiguration
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        LocalStrategy,
        JwtStrategy
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    describe('when validateUser is called', () => {

      describe('with valid user data', () => {
        let userResponseDto: any;
        let loginRequest = {
          username: "test",
          password: "dHE1>,t1fF32"
        };

        beforeEach(async () => {
          userResponseDto = await authService.validateUser(loginRequest.username, loginRequest.password);
        });

        test('then it should call usersService', () => {
          expect(usersService.findByUsername).toHaveBeenCalledTimes(1);
        });

        test('then it should return a user response dto without sensitive data', () => {
          let expectedResponse = plainToInstance(UserResponseDto, userStub());
          expect(userResponseDto).toEqual(expectedResponse);
          expect(userResponseDto.password).toBeUndefined();
          expect(userResponseDto.passwordHash).toBeUndefined();
        });
      });

      describe('with invalid user data', () => {
        let userResponseDto: any;
        let loginRequest = {
          username: "ciao",
          password: "sdfhjg"
        };

        beforeEach(async () => {
          userResponseDto = await authService.validateUser(loginRequest.username, loginRequest.password);
        });

        test('then it should return null', () => {
          expect(userResponseDto).toEqual(null);
        });

      });
    });
  });

  describe('login', () => {
    describe('when login is called', () => {
      let loginResponseDto: any;

      beforeEach(() => {
        loginResponseDto = authService.login(userResponseDtoStub());
      })

      it('should return a login response with the access token', () => {
        expect(loginResponseDto.access_token).toBeDefined();
      });

      it('should return valid access token with encapsulated serialized data without sensitive informations', async () => {
        var decodedData = jwt.verify(loginResponseDto.access_token, jwtConstants.secret) as any;

        expect(decodedData?.username).toEqual(userResponseDtoStub().username);
        expect(decodedData?.password).toBeUndefined();
        expect(decodedData?.passwordHash).toBeUndefined();
      });
    });
  });
});
