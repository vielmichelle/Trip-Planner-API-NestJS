import { userStub } from "../test/stubs/users.stub";

export const UsersService = jest.fn().mockReturnValue({
    findByUsername: jest.fn().mockResolvedValue(userStub())
});