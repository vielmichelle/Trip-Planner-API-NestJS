import { Injectable, Logger } from '@nestjs/common';
import { TripOrigin } from '../schemas/trip-origin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { seedTripsOriginsDestinations } from './origins-destinations-seed';
import { createIfNotExists } from 'src/common/utils/seed.utils';

@Injectable()
export class TripOriginsSeederService {
    private readonly logger = new Logger(TripOriginsSeederService.name, { timestamp: true });

    constructor(
        @InjectModel(TripOrigin.name) private tripOriginModel: Model<TripOrigin>
    ) { }

    async onModuleInit() {
        await this.seedTripOrigins();
    }

    private async seedTripOrigins() {
        try {

            this.logger.log("Trip Origins in progress...");

            for (let origin of seedTripsOriginsDestinations) {
                const tripOrigin: TripOrigin = { code: origin };
                await createIfNotExists(this.tripOriginModel, tripOrigin, { code: origin });
            }

            this.logger.log("Trip Origins completed");

        } catch (error) {
            this.logger.error(`Error occured during Users Seeding - ${error.message}`);
        }
    }
}
