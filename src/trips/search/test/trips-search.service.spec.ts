import { Test, TestingModule } from '@nestjs/testing';
import { TripsSearchService } from '../trips-search.service';
import { TripsRetrieveApiService } from '../../retrieve-api/trips-retrieve-api.service';
import { TripsSearchSortingEnum } from '../dto/enums/trips-search-sorting.enum';
import { TripsRetrieveApiResponseDto } from 'src/trips/retrieve-api/dto/trips-retrieve-api-response.dto';
import { tripsRetrieveApiStub } from 'src/trips/retrieve-api/test/stub/trips-retrieve-api.stub';

jest.mock('../../retrieve-api/trips-retrieve-api.service');

describe('TripsSearchService', () => {
  let tripsSearchService: TripsSearchService;
  let tripsRetrieveApiService: TripsRetrieveApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripsSearchService, TripsRetrieveApiService],
    }).compile();

    tripsSearchService = module.get<TripsSearchService>(TripsSearchService);
    tripsRetrieveApiService = module.get<TripsRetrieveApiService>(TripsRetrieveApiService);
  });

  it('should be defined', () => {
    expect(tripsSearchService).toBeDefined();
  });

  describe('getSortingOptions', () => {
    describe('when getSortingOptions is called', () => {
      let sortingOptions: string[];

      beforeEach(async () => {
        jest.spyOn(Object, 'values');
        sortingOptions = tripsSearchService.getSortingOptions();
      })

      test('then it should call Object.values', () => {
        expect(Object.values).toHaveBeenCalled();
      })

      test('then it should return sorting options', () => {
        expect(sortingOptions).toEqual(Object.values(TripsSearchSortingEnum))
      })
    })
  });

  describe('searchTrips', () => {
    describe('when searchTrips is called', () => {
      let trips: TripsRetrieveApiResponseDto[];
      let query = {
        origin: "SYD",
        destination: "GRU",
        sortBy: TripsSearchSortingEnum.Fastest,
        limit: 5
      };

      beforeEach(async () => {
        jest.spyOn(tripsRetrieveApiService, 'getTrips');
        trips = await tripsSearchService.searchTrips(
          query.origin,
          query.destination,
          query.sortBy,
          query.limit)
      })

      test('then it should call tripsRetrieveApiService', () => {
        expect(tripsRetrieveApiService.getTrips).toHaveBeenCalled()
      })

      test('then it should return an array of trips search results', () => {
        expect(trips.length).toEqual(tripsRetrieveApiStub().length);
        expect(trips).toEqual(expect.arrayContaining(tripsRetrieveApiStub()));
      })
    });

    describe('when searchTrips is called with sort_by', () => {

      it('should return trips search results ordered by duration for Fastest sorting', async () => {
        let query = {
          origin: "SYD",
          destination: "GRU",
          sortBy: TripsSearchSortingEnum.Fastest,
          limit: 20
        };

        jest.spyOn(tripsRetrieveApiService, 'getTrips');
        let trips = await tripsSearchService.searchTrips(
          query.origin,
          query.destination,
          query.sortBy,
          query.limit);

        let orderedResult = tripsRetrieveApiStub().sort((a, b) => a.duration - b.duration);
        expect(trips).toEqual(orderedResult);
      });

      it('should return trips search results ordered by cost for Cheapest sorting', async () => {
        let query = {
          origin: "SYD",
          destination: "GRU",
          sortBy: TripsSearchSortingEnum.Cheapest,
          limit: 20
        };

        jest.spyOn(tripsRetrieveApiService, 'getTrips');
        let trips = await tripsSearchService.searchTrips(
          query.origin,
          query.destination,
          query.sortBy,
          query.limit);

        let orderedResult = tripsRetrieveApiStub().sort((a, b) => a.cost - b.cost);
        expect(trips).toEqual(orderedResult);
      });
    });

    describe('when searchTrips is called with limit', () => {

      it('should return trips search results between 1 and the limit (2 example)', async () => {
        let query = {
          origin: "SYD",
          destination: "GRU",
          sortBy: TripsSearchSortingEnum.Fastest,
          limit: 2
        };

        jest.spyOn(tripsRetrieveApiService, 'getTrips');
        let trips = await tripsSearchService.searchTrips(
          query.origin,
          query.destination,
          query.sortBy,
          query.limit);

        expect(1 <= trips.length && trips.length <= 2).toBe(true);
      });

      it('should return trips search results between 1 and the default limit (5)', async () => {
        let query = {
          origin: "SYD",
          destination: "GRU",
          sortBy: TripsSearchSortingEnum.Fastest,
          limit: 2
        };

        jest.spyOn(tripsRetrieveApiService, 'getTrips');
        let trips = await tripsSearchService.searchTrips(
          query.origin,
          query.destination,
          query.sortBy,
          query.limit);

        expect(1 <= trips.length && trips.length <= 5).toBe(true);
      });
    });
  });
});