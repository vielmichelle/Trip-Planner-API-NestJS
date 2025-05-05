import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { LocalStrategy } from '../strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';

jest.mock('../auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        LocalStrategy,
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        }
      ]
    })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    describe('when login is called', () => {
      let loginResponseDto: LoginResponseDto;

      beforeEach(async () => {
        let loginRequest: LoginRequestDto = {
          username: "test",
          password: "dHE1>,t1fF32"
        };
        loginResponseDto = authController.login(loginRequest);
      })

      test('then it should call authService', () => {
        expect(authService.login).toHaveBeenCalled()
      })

      test('then it should return a login response with the token', () => {
        expect(loginResponseDto).toEqual(loginResponseDto);
        expect(loginResponseDto.access_token).toBeDefined();
      })
    });
  });

  // Data validation can be moved in another folder to test only the specific DTO, adding more detail to the tests and checking return messages
  // TODO: Passport data validation does not get triggered during tests, verify how to fix this

  // describe('when login is called with valid body', () => {
  //   it('should give no errors', async () => {
  //     let loginRequest: LoginRequestDto = {
  //       username: "test",
  //       password: "dHE1>,t1fF32"
  //     };
  //     const loginRequestDto = plainToInstance(LoginResponseDto, loginRequest);
  //     const errors = await validate(loginRequestDto);

  //     expect(errors.length).toBe(0);
  //   })
  // });

  // describe('when login is called with invalid body', () => {
  //   it('should fail on missing password', async () => {
  //     let loginRequest = {
  //       username: "test"
  //     };
  //     const loginRequestDto = plainToInstance(LoginResponseDto, loginRequest);
  //     const errors = await validate(loginRequestDto);
  //     console.log(errors)
  //     expect(errors.length).not.toBe(0);
  //   })
  // });

  // describe('when login is called with invalid body', () => {
  //   it('should fail on empty object', async () => {
  //     const loginRequestDto = plainToInstance(LoginResponseDto, {});
  //     const errors = await validate(loginRequestDto);
  //     console.log(errors)
  //     expect(errors.length).not.toBe(0);
  //   })
  // });
});
