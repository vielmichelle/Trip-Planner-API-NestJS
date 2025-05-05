import { tripsRetrieveApiStub } from "../test/stub/trips-retrieve-api.stub";

export const TripsRetrieveApiService = jest.fn().mockReturnValue({
    getTrips: jest.fn().mockResolvedValue(tripsRetrieveApiStub())
})