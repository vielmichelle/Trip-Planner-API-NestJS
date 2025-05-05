import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { DatabaseService } from 'src/common/database/database.service';
import { setupEnvironmentVariables } from '../support/setup-environment-variables';
import { generateBearerAuthenticationHeadersWithLogin, generateLoginRequest } from './support/authentication';
import * as jwt from 'jsonwebtoken';
import { LoginRequestDto } from 'src/core/auth/dto/login-request.dto';
import { jwtConstants } from 'src/core/auth/constants';

describe('Authentication (e2e)', () => {
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
        await app.init();

        dbConnection = app.get<DatabaseService>(DatabaseService).getConnection();
        httpServer = app.getHttpServer();

        tokenHeaders = await generateBearerAuthenticationHeadersWithLogin(httpServer);
    });

    afterAll(async () => {
        await app.close();
    });

    let authLoginRoute = '/auth/login';
    describe(`POST ${authLoginRoute}`, () => {

        describe('when login request have missing password', () => {
            let loginRequest = generateLoginRequest();

            it('should return 400 Bad Request', async () => {
                let invalidRequest = {
                    username: loginRequest.username,
                    password: ''
                };
                let response = await request(httpServer).post(authLoginRoute).send(invalidRequest);

                expect(response.status).toBe(401);
            });
        });

        describe('when login request is empty', () => {
            it('should return 401 Unauthorized', async () => {
                let response = await request(httpServer).post(authLoginRoute).send({});

                expect(response.status).toBe(401);
            });
        });

        describe('when login request contains invalid user', () => {
            let loginRequest = generateLoginRequest();

            it('should return 401 Unauthorized', async () => {
                let invalidRequest: LoginRequestDto = {
                    username: loginRequest.username,
                    password: 'kxj5hb348q7t4'
                };
                let response = await request(httpServer).post(authLoginRoute).send(invalidRequest);

                expect(response.status).toBe(401);
            });
        });

        describe('when login request contains valid user', () => {
            let response: any;
            let loginRequest = generateLoginRequest();

            beforeAll(async () => {
                response = await request(httpServer).post(authLoginRoute).send(loginRequest);
            })

            it('should return access token with 201 Created', async () => {
                expect(response.status).toBe(201);
                expect(response.body.access_token).toBeDefined();
            });

            it('should return valid access token with encapsulated serialized data', async () => {
                var decodedData = jwt.verify(response.body.access_token, jwtConstants.secret) as any;

                expect(decodedData?.username).toEqual(loginRequest.username);
                expect(decodedData?.password).toBeUndefined();
                expect(decodedData?.passwordHash).toBeUndefined();
            });
        });
    });
});