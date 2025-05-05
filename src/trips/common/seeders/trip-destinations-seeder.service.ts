import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TripDestination } from '../schemas/trip.destination.schema';
import { Model } from 'mongoose';
import { seedTripsOriginsDestinations } from './origins-destinations-seed';
import { createIfNotExists } from 'src/common/utils/seed.utils';

@Injectable()
export class TripDestinationsSeederService {
    private readonly logger = new Logger(TripDestinationsSeederService.name, { timestamp: true });

    constructor(
        @InjectModel(TripDestination.name) private tripDestinationModel: Model<TripDestination>
    ) { }

    async onModuleInit() {
        await this.seedTripDestinations();
    }

    private async seedTripDestinations() {
        try {

            this.logger.log("Trip Destinations Seeeding in progress...");

            for (let destination of seedTripsOriginsDestinations) {
                const tripDestination: TripDestination = { code: destination };
                await createIfNotExists(this.tripDestinationModel, tripDestination, { code: destination });
            }

            this.logger.log("Trip Destinations Seeeding completed");

        } catch (error) {
            this.logger.error(`Error occured during Trip Destinations - ${error.message}`);
        }
    }
}
