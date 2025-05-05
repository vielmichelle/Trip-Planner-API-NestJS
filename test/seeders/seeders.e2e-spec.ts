import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Connection } from 'mongoose';
import { DatabaseService } from 'src/common/database/database.service';
import { usersPasswordsSeedStub as originalUsersSeedStub, usersSeedStub } from 'src/core/users/test/stubs/users.stub';
import { User } from 'src/core/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { setupEnvironmentVariables } from '../support/setup-environment-variables';
import { tripsDestinationsSeedStub } from 'src/trips/test/stubs/trips-destinations.stub';
import { TripDestination } from 'src/trips/common/schemas/trip.destination.schema';
import { tripsOriginsSeedStub } from 'src/trips/test/stubs/trips-origins.stub';
import { TripOrigin } from 'src/trips/common/schemas/trip-origin.schema';

describe('Seeding (e2e)', () => {
    let app: INestApplication;
    let dbConnection: Connection;

    setupEnvironmentVariables();

    // Isolate seeding database for avoiding data inconsistency
    process.env.DB_NAME = `${process.env.DB_NAME}-seeders`;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        dbConnection = app.get<DatabaseService>(DatabaseService).getConnection();
    });

    afterAll(async () => {
        await dbConnection.dropDatabase();
        await app.close();
    });

    describe('On users module init', () => {
        describe('Seed users on database', () => {
            let users: any;
            let expectedResult: any;

            beforeAll(async () => {
                expectedResult = await usersSeedStub();
                users = await dbConnection.collection('users').find().toArray();
            });

            it('should save an array of seed users', async () => {
                expect(Array.isArray([users])).toBe(true);
                expect(users.length).toEqual(expectedResult.length);
                expect(users.map((user: User) => user.username))
                    .toEqual(expectedResult.map((user: User) => user.username));
            });

            it('should hash passwords correctly', () => {
                let originalUsers = originalUsersSeedStub();
                let checkHashArray = users.map((user: User) => {
                    let originalUserPassword = originalUsers.find(originalUser => originalUser.username == user.username)?.password;
                    return bcrypt.compareSync(originalUserPassword, user.passwordHash);
                })
                expect(checkHashArray.every((v: boolean) => v === true)).toBe(true);
            });
        });
    });

    describe('On trip module init', () => {
        describe('Seed trip origins on database', () => {
            let tripOrigins: any;
            let expectedResult: any;

            beforeAll(async () => {
                expectedResult = tripsOriginsSeedStub();
                tripOrigins = await dbConnection.collection('triporigins').find().toArray();
            });

            it('should save an array of seed trip origins', async () => {
                expect(Array.isArray([tripOrigins])).toBe(true);
                expect(tripOrigins.length).toEqual(expectedResult.length);
                expect(tripOrigins.map((tripOrigin: TripOrigin) => tripOrigin.code))
                    .toEqual(expectedResult.map((tripOriginRes: TripOrigin) => tripOriginRes.code));
            });
        });

        describe('Seed trip destinations on database', () => {
            let tripDestinations: any;
            let expectedResult: any;

            beforeAll(async () => {
                expectedResult = tripsDestinationsSeedStub();
                tripDestinations = await dbConnection.collection('tripdestinations').find().toArray();
            });

            it('should save an array of seed trip destinations', async () => {
                expect(Array.isArray([tripDestinations])).toBe(true);
                expect(tripDestinations.length).toEqual(expectedResult.length);
                expect(tripDestinations.map((tripDestination: TripDestination) => tripDestination.code))
                    .toEqual(expectedResult.map((tripDestinationRes: TripDestination) => tripDestinationRes.code));
            });
        });
    });
});