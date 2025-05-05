import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TripOrigin } from './common/schemas/trip-origin.schema';
import { Model } from 'mongoose';
import { TripDestination } from './common/schemas/trip.destination.schema';

@Injectable()
export class TripsService {

    constructor(
        @InjectModel(TripOrigin.name) private tripOriginModel: Model<TripOrigin>,
        @InjectModel(TripDestination.name) private tripDestinationModel: Model<TripDestination>
    ) { }

    async getOrigins(): Promise<TripOrigin[]> {
        return await this.tripOriginModel
            .find()
            .sort({ code: 'asc' });
    }

    async getDestinations(): Promise<TripDestination[]> {
        return await this.tripDestinationModel
            .find()
            .sort({ code: 'asc' });
    }
}
