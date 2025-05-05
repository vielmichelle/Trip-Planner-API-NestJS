import mongoose from "mongoose";
import { TripDestination } from "src/trips/common/schemas/trip.destination.schema";
import { seedTripsOriginsDestinations } from "src/trips/common/seeders/origins-destinations-seed";

export const tripDestinationStub = (): TripDestination => {
    return {
        _id: new mongoose.Types.ObjectId("6815d668f1759221f05c16ad"),
        code: "ATL"
    };
}

export const tripsDestinationsSeedStub = (): TripDestination[] => {
    return seedTripsOriginsDestinations.map(destination => <TripDestination>{
        _id: new mongoose.Types.ObjectId(),
        code: destination
    })
}