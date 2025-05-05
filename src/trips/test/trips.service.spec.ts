import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from '../trips.service';
import { getModelToken } from '@nestjs/mongoose';
import { TripOrigin } from '../common/schemas/trip-origin.schema';
import { TripDestination } from '../common/schemas/trip.destination.schema';
import { tripDestinationStub } from './stubs/trips-destinations.stub';
import { Model, Query } from 'mongoose';
import { tripOriginStub } from './stubs/trips-origins.stub';

export const mockingTripOriginModel = {
  find: jest.fn()
};

export const mockingTripDestinationModel = {
  find: jest.fn()
};

describe('TripsService', () => {
  let tripsService: TripsService;
  let tripOriginModelMock: Model<TripOrigin>;
  let tripDestinationModelMock: Model<TripDestination>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        {
          provide: getModelToken(TripOrigin.name),
          useValue: mockingTripOriginModel
        },
        {
          provide: getModelToken(TripDestination.name),
          useValue: mockingTripDestinationModel
        }
      ],
    }).compile();

    tripsService = module.get<TripsService>(TripsService);
    tripOriginModelMock = module.get<Model<TripOrigin>>(getModelToken(TripOrigin.name));
    tripDestinationModelMock = module.get<Model<TripDestination>>(getModelToken(TripDestination.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(tripsService).toBeDefined();
  });

  describe('getOrigins', () => {
    describe('when getOrigins is called', () => {
      let tripOrigins: TripOrigin[];

      beforeEach(async () => {
        jest.spyOn(tripOriginModelMock, 'find').mockReturnValue({
          sort: jest.fn().mockResolvedValue([tripOriginStub()]),
        } as unknown as Query<TripOrigin[], TripOrigin>);

        tripOrigins = await tripsService.getOrigins();
      })

      test('then it should call tripOriginModel', () => {
        expect(tripOriginModelMock.find).toHaveBeenCalledTimes(1);
      })

      test('then it should return an array of trips origins', () => {
        expect(tripOrigins).toEqual([tripOriginStub()]);
      })
    });

    describe('getDestinations', () => {
      describe('when getDestinations is called', () => {
        let tripDestinations: TripDestination[];

        beforeEach(async () => {
          jest.spyOn(tripDestinationModelMock, 'find').mockReturnValue({
            sort: jest.fn().mockResolvedValue([tripDestinationStub()]),
          } as unknown as Query<TripDestination[], TripDestination>);

          tripDestinations = await tripsService.getDestinations();
        })

        test('then it should call tripDestinationModel', () => {
          expect(tripDestinationModelMock.find).toHaveBeenCalledTimes(1);
        })

        test('then it should return an array of trips destinations', () => {
          expect(tripDestinations).toEqual([tripDestinationStub()]);
        })
      });
    });
  });
});