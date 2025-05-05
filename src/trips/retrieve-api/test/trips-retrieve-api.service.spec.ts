import { Test, TestingModule } from '@nestjs/testing';
import { TripsRetrieveApiService } from '../trips-retrieve-api.service';
import { ApiConfigsService } from 'src/common/configs/api-configs.service';
import { HttpService } from '@nestjs/axios';
import { TripsRetrieveApiResponseDto } from '../dto/trips-retrieve-api-response.dto';
import { tripsRetrieveApiStub } from './stub/trips-retrieve-api.stub';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';

export const mockingHttpService = {
  get: jest.fn()
};

export const headers = { 'X-API-KEY': 'test-api-key' };

describe('TripsRetrieveApiService', () => {
  let tripsRetrieveApiService: TripsRetrieveApiService;
  let httpService: HttpService;
  let apiConfigsService: ApiConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        TripsRetrieveApiService,
        ConfigService,
        ApiConfigsService,
        {
          provide: HttpService,
          useValue: mockingHttpService
        }
      ],
    }).compile();

    tripsRetrieveApiService = module.get<TripsRetrieveApiService>(TripsRetrieveApiService);
    httpService = module.get<HttpService>(HttpService);
    apiConfigsService = module.get<ApiConfigsService>(ApiConfigsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(tripsRetrieveApiService).toBeDefined();
  });

  describe('getTrips', () => {
    describe('when getTrips is called', () => {
      let trips: TripsRetrieveApiResponseDto[];
      const request = {
        origin: 'SYD',
        destination: 'GRU'
      };

      const host = 'http://api.example.com';
      const route = '/trips';
      const apiKey = 'test-api-key';
      const data = tripsRetrieveApiStub();
      const response: AxiosResponse<TripsRetrieveApiResponseDto[]> = {
        data: data,
        headers: headers,
        config: {
          url: 'http://api.example.com/trips',
          headers: <AxiosRequestHeaders>{}
        },
        status: 200,
        statusText: 'OK'
      };

      beforeEach(async () => {
        jest.spyOn(apiConfigsService, 'tripsSearchRetrieveApiRoute', 'get').mockReturnValue(route);
        jest.spyOn(apiConfigsService, 'tripsSearchRetrieveApiHost', 'get').mockReturnValue(host);
        jest.spyOn(apiConfigsService, 'tripsSearchRetrieveApiKey', 'get').mockReturnValue(apiKey);
        jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));
        trips = await tripsRetrieveApiService.getTrips(request.origin, request.destination);
      })

      test('then it should call httpService', () => {
        expect(httpService.get).toHaveBeenCalledWith(
          `${host}${route}?origin=${request.origin}&destination=${request.destination}`,
          { headers: headers });
      })

      test('then it should return an array of trips origins', () => {
        expect(trips).toEqual(data);
      })
    });

    describe('when getTrips is called with origin/destination that gives no results', () => {
      const request = {
        origin: 'CIA',
        destination: 'HAI'
      };

      const host = 'http://api.example.com';
      const route = '/trips';
      const apiKey = 'test-api-key';
      const response: AxiosResponse<TripsRetrieveApiResponseDto[]> = {
        data: [],
        headers: headers,
        config: {
          url: 'http://api.example.com/trips',
          headers: <AxiosRequestHeaders>{}
        },
        status: 200,
        statusText: 'OK'
      };

      test('then it should throw 404 Not Found exception', async () => {
        jest.spyOn(apiConfigsService, 'tripsSearchRetrieveApiRoute', 'get').mockReturnValue(route);
        jest.spyOn(apiConfigsService, 'tripsSearchRetrieveApiHost', 'get').mockReturnValue(host);
        jest.spyOn(apiConfigsService, 'tripsSearchRetrieveApiKey', 'get').mockReturnValue(apiKey);
        jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));
        await expect(
          tripsRetrieveApiService.getTrips(request.origin, request.destination))
          .rejects.toThrow(NotFoundException);
      })
    });

    describe('when getTrips is called and returns an error', () => {
      const request = {
        origin: 'CIA',
        destination: 'HAI'
      };

      const host = '';
      const route = '/trips';
      const apiKey = 'test-api-key';
      const response: AxiosResponse<TripsRetrieveApiResponseDto[]> = {
        data: [],
        headers: headers,
        config: {
          url: '/trips',
          headers: <AxiosRequestHeaders>{}
        },
        status: 200,
        statusText: 'OK'
      };

      test('then it should throw 503 Service Unavailable', async () => {
        jest.spyOn(apiConfigsService, 'tripsSearchRetrieveApiRoute', 'get').mockReturnValue(route);
        jest.spyOn(apiConfigsService, 'tripsSearchRetrieveApiHost', 'get').mockReturnValue(host);
        jest.spyOn(apiConfigsService, 'tripsSearchRetrieveApiKey', 'get').mockReturnValue(apiKey);
        jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));
        await expect(
          tripsRetrieveApiService.getTrips(request.origin, request.destination))
          .rejects.toThrow(ServiceUnavailableException);
      })
    });
  });
});