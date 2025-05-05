import { Module } from '@nestjs/common';
import { TripsSearchModule } from './search/trips-search.module';
import { TripsController } from './trips.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { TripsService } from './trips.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TripDestination, TripDestinationSchema } from './common/schemas/trip.destination.schema';
import { TripOrigin, TripOriginSchema } from './common/schemas/trip-origin.schema';
import { TripOriginsSeederService } from './common/seeders/trip-origins-seeder.service';
import { TripDestinationsSeederService } from './common/seeders/trip-destinations-seeder.service';

@Module({
    imports: [
        TripsSearchModule,
        CacheModule.register(),
        MongooseModule.forFeature([
            { name: TripOrigin.name, schema: TripOriginSchema },
            { name: TripDestination.name, schema: TripDestinationSchema }
        ])
    ],
    controllers: [TripsController],
    providers: [TripsService, TripOriginsSeederService, TripDestinationsSeederService]
})
export class TripsModule { }
