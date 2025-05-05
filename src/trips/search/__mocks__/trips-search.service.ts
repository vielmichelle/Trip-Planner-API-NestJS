import { tripSearchSortingOptionStub } from "../test/stubs/trip-search-sorting-option.stub";
import { tripSearchStub } from "../test/stubs/trip-search.stub";

export const TripsSearchService = jest.fn().mockReturnValue({
    getSortingOptions: jest.fn().mockReturnValue([tripSearchSortingOptionStub()]),
    searchTrips: jest.fn().mockResolvedValue([tripSearchStub()])
})