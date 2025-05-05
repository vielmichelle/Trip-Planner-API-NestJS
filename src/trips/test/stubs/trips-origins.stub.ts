import { TripOrigin } from "src/trips/common/schemas/trip-origin.schema";
import mongoose from 'mongoose';
import { seedTripsOriginsDestinations } from "src/trips/common/seeders/origins-destinations-seed";

export const tripOriginStub = (): TripOrigin => {
  return {
    _id: new mongoose.Types.ObjectId("6815d668f1759221f05c16ad"),
    code: "PEK"
  };
}

export const tripsOriginsSeedStub = (): TripOrigin[] => {
  return seedTripsOriginsDestinations.map(destination => <TripOrigin>{
    _id: new mongoose.Types.ObjectId(),
    code: destination
  })
}