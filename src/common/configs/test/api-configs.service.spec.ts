import { Test, TestingModule } from '@nestjs/testing';
import { ApiConfigsService } from '../api-configs.service';
import { ConfigService } from '@nestjs/config';

describe('ApiConfigsService', () => {
  let apiConfigService: ApiConfigsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiConfigsService, ConfigService],
    }).compile();

    apiConfigService = module.get<ApiConfigsService>(ApiConfigsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(apiConfigService).toBeDefined();
  });
});
