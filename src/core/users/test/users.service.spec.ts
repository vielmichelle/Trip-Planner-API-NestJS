import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model, Query } from 'mongoose';
import { userSeedWithPasswordHashStub } from './stubs/users.stub';

export const mockingUserModel = {
  findOne: jest.fn()
};

describe('UsersService', () => {
  let usersService: UsersService;
  let userModelMock: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockingUserModel
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModelMock = module.get<Model<User>>(getModelToken(User.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findByUsername', () => {
    describe('when findByUsername is called', () => {
      let user: User | null;

      beforeEach(async () => {
        jest.spyOn(userModelMock, 'findOne').mockReturnValue({
          exec: jest.fn().mockResolvedValue(userSeedWithPasswordHashStub()),
        } as unknown as Query<User, User>);

        user = await usersService.findByUsername('test');
      })

      test('then it should call userModel', () => {
        expect(userModelMock.findOne).toHaveBeenCalledTimes(1);
      })

      test('then it should return the found user', () => {
        expect(user).toEqual(userSeedWithPasswordHashStub());
      })
    });
  });
});
