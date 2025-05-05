import { Injectable } from '@nestjs/common';
import { TripsRetrieveApiService } from '../retrieve-api/trips-retrieve-api.service';
import { TripsSearchSortingEnum } from './dto/enums/trips-search-sorting.enum';
import { TripsRetrieveApiResponseDto } from '../retrieve-api/dto/trips-retrieve-api-response.dto';

@Injectable()
export class TripsSearchService {
  constructor(private readonly retrieveApi: TripsRetrieveApiService) { }

  getSortingOptions() {
    return Object.values(TripsSearchSortingEnum);
  }

  async searchTrips(origin: string, destination: string, sortBy: TripsSearchSortingEnum, limit: number): Promise<TripsRetrieveApiResponseDto[]> {
    var trips = await this.retrieveApi.getTrips(origin, destination);

    // TODO: Manage sorting more dinamically

    // Sort results
    switch (sortBy) {
      case TripsSearchSortingEnum.Cheapest:
        this.sortByCheapest(trips);
        break;

      case TripsSearchSortingEnum.Fastest:
      default:
        this.sortByFastest(trips);
        break;
    }

    // Limit to relevant results
    trips = trips.slice(0, limit);

    return trips;
  }

  private sortByFastest(trips: TripsRetrieveApiResponseDto[]) {
    trips.sort((a, b) => this.compareNumbers(a.duration, b.duration));
  }

  private sortByCheapest(trips: TripsRetrieveApiResponseDto[]) {
    trips.sort((a, b) => this.compareNumbers(a.cost, b.cost));
  }

  private compareNumbers = (a: number, b: number) => {
    return a - b;
  }
}