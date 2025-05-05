import { loginResponseStub, userResponseDtoStub } from "../test/stubs/auth-stubs";

export const AuthService = jest.fn().mockReturnValue({
    validateUser: jest.fn().mockResolvedValue(userResponseDtoStub()),
    login: jest.fn().mockReturnValue(loginResponseStub())
});