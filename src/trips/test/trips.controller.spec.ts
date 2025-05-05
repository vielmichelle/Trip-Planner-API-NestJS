import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from '../trips.controller';
import { TripsService } from '../trips.service';
import { CacheModule } from '@nestjs/cache-manager';
import { TripOrigin } from '../common/schemas/trip-origin.schema';
import { tripOriginStub } from './stubs/trips-origins.stub';
import { tripDestinationStub } from './stubs/trips-destinations.stub';

jest.mock('../trips.service');

describe('TripsController', () => {
  let tripsController: TripsController;
  let tripsService: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [TripsController],
      providers: [TripsService],
    }).compile();

    tripsController = module.get<TripsController>(TripsController);
    tripsService = module.get<TripsService>(TripsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(tripsController).toBeDefined();
  });

  describe('getOrigins', () => {
    describe('when getOrigins is called', () => {
      let tripOrigins: TripOrigin[];

      beforeEach(async () => {
        tripOrigins = await tripsController.getOrigins()
      })

      test('then it should call tripsService', () => {
        expect(tripsService.getOrigins).toHaveBeenCalled()
      })

      test('then it should return an array of trips origins', () => {
        expect(tripOrigins).toEqual([tripOriginStub()]);
      })
    });
  });

  describe('getDestinations', () => {
    describe('when getDestinations is called', () => {
      let tripDestinations: TripOrigin[];

      beforeEach(async () => {
        tripDestinations = await tripsController.getDestinations()
      })

      test('then it should call tripsService', () => {
        expect(tripsService.getDestinations).toHaveBeenCalled()
      })

      test('then it should return an array of trips destinations', () => {
        expect(tripDestinations).toEqual([tripDestinationStub()]);
      })
    });
  });
});
