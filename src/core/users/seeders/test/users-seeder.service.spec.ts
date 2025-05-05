import { Test, TestingModule } from '@nestjs/testing';
import { UsersSeederService } from '../users-seeder.service';
import { User } from '../../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersSeederService', () => {
  let service: UsersSeederService;

  const userModel: User[] = [
    {
      username: 'john',
      passwordHash: '$2b$10$HseoZ.skGmFI1bG/3.mWguY8vuuPYsGuX3cbnRKALJYfs3ZxHCevS', // changeme
    },
    {
      username: 'maria',
      passwordHash: '$2b$10$RRae0AmwaWMwL6tKBTSas.loFDpSLUGQLSNF1kcuzRLNCjwqM9O4C', // guess
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersSeederService,
        {
          provide: getModelToken(User.name),
          useValue: userModel
        },
      ],
    }).compile();

    service = module.get<UsersSeederService>(UsersSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
