import { Test, TestingModule } from '@nestjs/testing';
import { TripDestinationsSeederService } from '../trip-destinations-seeder.service';
import { TripDestination } from '../../schemas/trip.destination.schema';
import { getModelToken } from '@nestjs/mongoose';
import { seedTripsOriginsDestinations } from '../origins-destinations-seed';

describe('TripDestinationsSeederService', () => {
  let tripDestinationsSeederService: TripDestinationsSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripDestinationsSeederService,
        {
          provide: getModelToken(TripDestination.name),
          useValue: seedTripsOriginsDestinations
        },
      ],
    }).compile();

    tripDestinationsSeederService = module.get<TripDestinationsSeederService>(TripDestinationsSeederService);
  });

  it('should be defined', () => {
    expect(tripDestinationsSeederService).toBeDefined();
  });
});
