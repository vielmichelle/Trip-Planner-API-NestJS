import { Test, TestingModule } from '@nestjs/testing';
import { TripOriginsSeederService } from '../trip-origins-seeder.service';
import { TripOrigin } from '../../schemas/trip-origin.schema';
import { seedTripsOriginsDestinations } from '../origins-destinations-seed';
import { getModelToken } from '@nestjs/mongoose';

describe('TripOriginsSeederService', () => {
  let tripOriginsSeederService: TripOriginsSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripOriginsSeederService,
        {
          provide: getModelToken(TripOrigin.name),
          useValue: seedTripsOriginsDestinations
        }
      ],
    }).compile();

    tripOriginsSeederService = module.get<TripOriginsSeederService>(TripOriginsSeederService);
  });

  it('should be defined', () => {
    expect(tripOriginsSeederService).toBeDefined();
  });
});
