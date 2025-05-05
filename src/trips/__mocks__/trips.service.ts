import { tripDestinationStub } from "../test/stubs/trips-destinations.stub";
import { tripOriginStub } from "../test/stubs/trips-origins.stub";

export const TripsService = jest.fn().mockReturnValue({
    getOrigins: jest.fn().mockResolvedValue([tripOriginStub()]),
    getDestinations: jest.fn().mockResolvedValue([tripDestinationStub()])
})