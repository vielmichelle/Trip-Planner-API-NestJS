import { Test, TestingModule } from '@nestjs/testing';
import { TripsSearchController } from '../trips-search.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { TripsSearchService } from '../trips-search.service';
import { tripSearchSortingOptionStub } from './stubs/trip-search-sorting-option.stub';
import { tripSearchStub } from './stubs/trip-search.stub';
import { TripsRetrieveApiResponseDto } from 'src/trips/retrieve-api/dto/trips-retrieve-api-response.dto';
import { TripsSearchSortingEnum } from '../dto/enums/trips-search-sorting.enum';
import { TripsSearchFindAllQuery } from '../dto/query/trips-search-find-all.query';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

jest.mock('../trips-search.service');

describe('TripsSearchController', () => {
  let tripsSearchController: TripsSearchController;
  let tripsSearchService: TripsSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [TripsSearchController],
      providers: [TripsSearchService]
    }).compile();

    tripsSearchController = module.get<TripsSearchController>(TripsSearchController);
    tripsSearchService = module.get<TripsSearchService>(TripsSearchService);
  });

  it('should be defined', () => {
    expect(tripsSearchController).toBeDefined();
  });

  describe('getSortingOptions', () => {
    describe('when getSortingOptions is called', () => {
      let sortingOptions: string[];

      beforeEach(async () => {
        sortingOptions = tripsSearchController.getSortingOptions();
      })

      test('then it should call tripsSearchService', () => {
        expect(tripsSearchService.getSortingOptions).toHaveBeenCalled();
      })

      test('then it should return sorting options', () => {
        expect(sortingOptions).toEqual([tripSearchSortingOptionStub()])
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
        trips = await tripsSearchService.searchTrips(
          query.origin,
          query.destination,
          query.sortBy,
          query.limit)
      })

      test('then it should call tripsSearchService', () => {
        expect(tripsSearchService.searchTrips).toHaveBeenCalled()
      })

      test('then it should return an array of trips search results', () => {
        expect(trips).toEqual([tripSearchStub()]);
      })
    });

    // Data validation can be moved in another folder to test only the specific DTO, adding more detail to the tests and checking return messages

    describe('when searchTrips is called with valid query parameters', () => {
      it('should give no errors', async () => {
        const query = {
          origin: 'SYD',
          destination: 'GRU',
          sort_by: TripsSearchSortingEnum.Fastest,
          limit: 3
        };
        const queryDto = plainToInstance(TripsSearchFindAllQuery, query);
        const errors = await validate(queryDto);

        expect(errors.length).toBe(0);
      })
    });

    describe('when searchTrips is called with only mandatory query parameters', () => {
      it('should give no errors', async () => {
        const query = {
          origin: 'SYD',
          destination: 'GRU'
        };
        const queryDto = plainToInstance(TripsSearchFindAllQuery, query);
        const errors = await validate(queryDto);

        expect(errors.length).toBe(0);
      })
    });

    describe('when searchTrips is called with invalid query parameters', () => {
      it('should fail on invalid dto', async () => {
        const query = {
          origin: 'sdfgh',
          sort_by: 12,
          limit: 'sdfj'
        };
        const queryDto = plainToInstance(TripsSearchFindAllQuery, query);
        const errors = await validate(queryDto);

        expect(errors.length).not.toBe(0);
      });

      it('should fail on missing origin', async () => {
        const query = {
          destination: 'GRU'
        };
        const queryDto = plainToInstance(TripsSearchFindAllQuery, query);
        const errors = await validate(queryDto);

        expect(errors.length).not.toBe(0);
      });

      it('should fail on missing destination', async () => {
        const query = {
          origin: 'SYD',
        };
        const queryDto = plainToInstance(TripsSearchFindAllQuery, query);
        const errors = await validate(queryDto);

        expect(errors.length).not.toBe(0);
      });

      it('should fail with invalid sort_by', async () => {
        const query = {
          origin: 'SYD',
          destination: 'GRU',
          sort_by: 'sgdh'
        };
        const queryDto = plainToInstance(TripsSearchFindAllQuery, query);
        const errors = await validate(queryDto);

        expect(errors.length).not.toBe(0);
      });

      it('should fail with invalid limit', async () => {
        const query = {
          origin: 'SYD',
          destination: 'GRU',
          limit: -1
        };
        const queryDto = plainToInstance(TripsSearchFindAllQuery, query);
        const errors = await validate(queryDto);

        expect(errors.length).not.toBe(0);
      });
    });
  });
});