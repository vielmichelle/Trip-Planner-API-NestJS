import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { DatabaseService } from 'src/common/database/database.service';
import { generateBearerAuthenticationHeadersWithLogin } from './support/authentication';
import { setupEnvironmentVariables } from '../support/setup-environment-variables';
import { TripsSearchSortingEnum } from 'src/trips/search/dto/enums/trips-search-sorting.enum';
import { XCacheHeaderHitValue, XCacheHeaderKey, XCacheHeaderMissValue } from '../support/constants';
import { TripsSearchResponseDto } from 'src/trips/search/dto/trips-search-response.dto';

describe('Trips Search (e2e)', () => {
    let app: INestApplication;
    let dbConnection: Connection;
    let httpServer: any;
    let tokenHeaders: any;

    setupEnvironmentVariables();

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        dbConnection = app.get<DatabaseService>(DatabaseService).getConnection();
        httpServer = app.getHttpServer();

        tokenHeaders = await generateBearerAuthenticationHeadersWithLogin(httpServer);
    });

    afterAll(async () => {
        await app.close();
    });

    const tripsSearchSortingRoute = '/trips/search/sorting';
    describe(`GET ${tripsSearchSortingRoute}`, () => {
        describe('when NO bearer token header is provided', () => {
            it('should return 401 Unauthorized', async () => {
                let response = await request(httpServer).get(tripsSearchSortingRoute);

                expect(response.status).toBe(401);
            });
        });

        describe('when bearer token header is provided', () => {
            let response: any;
            let expectedResult = Object.values(TripsSearchSortingEnum);

            beforeAll(async () => {
                response = await request(httpServer).get(tripsSearchSortingRoute).set(tokenHeaders);
            });

            it('should return an array with 200 OK', async () => {
                expect(response.status).toBe(200);
                expect(Array.isArray([response.body])).toBe(true);
                expect(response.body.length).toEqual(expectedResult.length);
            });

            it('should return a cached response array of trip origins', async () => {
                let cachedResponse = await request(httpServer).get(tripsSearchSortingRoute).set(tokenHeaders);

                expect(response.header[XCacheHeaderKey]).toEqual(XCacheHeaderMissValue);
                expect(cachedResponse.header[XCacheHeaderKey]).toEqual(XCacheHeaderHitValue);
                expect(response.body).toEqual(cachedResponse.body);
            });
        });
    });

    const tripsSearchRoute = '/trips/search';
    describe(`GET ${tripsSearchRoute}`, () => {
        describe('when NO bearer token header is provided', () => {
            it('should return 401 Unauthorized', async () => {
                let response = await request(httpServer).get(tripsSearchRoute);
                expect(response.status).toBe(401);
            });
        });

        describe('when bearer token header is provided', () => {

            describe('when only mandatory origin/destination params are provided and valid', () => {
                let response: any;
                let params = {
                    origin: "SYD",
                    destination: "GRU"
                };

                beforeAll(async () => {
                    response = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);
                });

                it('should return an array with 200 OK', async () => {
                    expect(response.status).toBe(200);
                    expect(Array.isArray([response.body])).toBe(true);
                    expect(response.body.length > 1).toBe(true);
                });

                it('should return an array of trips serialized as dto', () => {
                    const keys = Object.keys(response.body[0]);
                    const expectedKeys = Object.keys(new TripsSearchResponseDto());
                    let isCorrectlySerialized = keys.length === expectedKeys.length &&
                        expectedKeys.every(key => keys.includes(key));

                    expect(isCorrectlySerialized).toBe(true);
                })

                it('should return a cached response array of trip origins with intact dto serialization', async () => {
                    let cachedResponse = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);

                    expect(response.header[XCacheHeaderKey]).toEqual(XCacheHeaderMissValue);
                    expect(cachedResponse.header[XCacheHeaderKey]).toEqual(XCacheHeaderHitValue);
                    expect(response.body).toEqual(cachedResponse.body);
                });
            });

            describe('when mandatory origin/destination params are provided with sort_by', () => {
                it('should return an array of trip origins ordered by fastest', async () => {
                    let params = {
                        origin: "SYD",
                        destination: "GRU",
                        sort_by: TripsSearchSortingEnum.Fastest
                    };
                    let response = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);

                    let orderedResults = response.body.sort((a, b) => a.duration - b.duration);

                    expect(response.status).toBe(200);
                    expect(response.body).toEqual(orderedResults);
                });

                it('should return an array of trip origins ordered by cheapest', async () => {
                    let params = {
                        origin: "SYD",
                        destination: "GRU",
                        sort_by: TripsSearchSortingEnum.Cheapest
                    };
                    let response = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);

                    let orderedResults = response.body.sort((a, b) => a.cost - b.cost);

                    expect(response.status).toBe(200);
                    expect(response.body).toEqual(orderedResults);
                });

                it('should return 400 Bad Request if sort_by is invalid', async () => {
                    let params = {
                        origin: "SYD",
                        destination: "GRU",
                        sort_by: 'wrong_value'
                    };
                    let response = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);

                    expect(response.status).toBe(400);
                });
            });

            describe('when mandatory origin/destination params are provided with limit', () => {
                it('should return an array of trip origins between 1 and the limit (2 example)', async () => {
                    let params = {
                        origin: "SYD",
                        destination: "GRU",
                        limit: 2
                    };
                    let response = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);

                    expect(response.status).toBe(200);
                    expect(1 <= response.body.length && response.body.length <= 2).toBe(true);
                });

                it('should return an array of trip origins between 1 and the default limit (5)', async () => {
                    let params = {
                        origin: "SYD",
                        destination: "GRU"
                    };
                    let response = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);

                    expect(response.status).toBe(200);
                    expect(1 <= response.body.length && response.body.length <= 5).toBe(true);
                });

                it('should return 400 Bad Request if limit is invalid', async () => {
                    let params = {
                        origin: "SYD",
                        destination: "GRU",
                        limit: 'wrong_value'
                    };
                    let response = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);
                    expect(response.status).toBe(400);
                });
            });

            describe('when no params are provided', () => {
                it('should return 400 Bad Request', async () => {
                    let response = await request(httpServer).get(tripsSearchRoute).set(tokenHeaders);
                    expect(response.status).toBe(400);
                });
            });

            describe('when invalid params are provided', () => {
                it('should return 400 Bad Request', async () => {
                    let params = {
                        origin: "axc3",
                        destination: ""
                    };
                    let response = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);
                    expect(response.status).toBe(400);
                });
            });

            describe('when no results are found for origin and destination provided', () => {
                it('should return 404 Not Found', async () => {
                    let params = {
                        origin: "CIA",
                        destination: "OFD"
                    };
                    let response = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);
                    expect(response.status).toBe(404);
                });
            });
        });
    });
});

// TODO: Generate dinamically
const generateUrlWithParams = (route: string, params: any) => {
    let url = new URL(route, 'http://example.com');
    if (params.origin) {
        url.searchParams.append("origin", params.origin);
    }

    if (params.destination) {
        url.searchParams.append("destination", params.destination);
    }

    if (params.sort_by) {
        url.searchParams.append("sort_by", params.sort_by);
    }

    if (params.limit) {
        url.searchParams.append("limit", params.limit);
    }

    return `${route}${url.search}`;
}