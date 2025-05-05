import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { TripsRetrieveApiResponseDto } from './dto/trips-retrieve-api-response.dto';
import { ApiConfigsService } from 'src/common/configs/api-configs.service';

@Injectable()
export class TripsRetrieveApiService {

    constructor(
        private readonly httpService: HttpService,
        private readonly apiConfigs: ApiConfigsService
    ) { }

    async getTrips(origin: string, destination: string): Promise<TripsRetrieveApiResponseDto[]> {
        try {

            // Generate url with searching parameters
            const tripsUrl = new URL(this.apiConfigs.tripsSearchRetrieveApiRoute, this.apiConfigs.tripsSearchRetrieveApiHost);
            tripsUrl.searchParams.append("origin", origin);
            tripsUrl.searchParams.append("destination", destination);

            // Create configuration with APIKEY inside headers
            const configuration = {
                headers: {
                    'X-API-KEY': this.apiConfigs.tripsSearchRetrieveApiKey
                }
            };

            const { data } = await firstValueFrom(
                this.httpService.get<TripsRetrieveApiResponseDto[]>(tripsUrl.toString(), configuration)
            );

            if (!data || data.length == 0) {
                throw new NotFoundException();
            }

            return data;
        }
        catch (error) {
            // Error returned from http get response or during the request
            if (error instanceof AxiosError) {
                throw new ServiceUnavailableException(this.standardError(origin, destination), {
                    cause: this.standardError(origin, destination, `Response status ${error.status} ${JSON.stringify(error.response?.data)}`),
                    description: `External resource returned an unexpected response. Retry later`
                });
            }
            // Error returned in case of no results available for the specified parameters
            else if (error instanceof NotFoundException) {
                throw new NotFoundException(`No results found for origin ${origin} and destination ${destination}`);
            }
            // Other non managed errors
            else {
                throw new ServiceUnavailableException(this.standardError(origin, destination), {
                    cause: this.standardError(origin, destination, error.message),
                    description: `Unexpected error during request processing. Retry later`
                });
            }
        }
    }

    private standardError = (origin: string, destination: string, extraMessage?: string) => {
        let error = `Error occured retrieving trips results for origin ${origin} and destination ${destination}`;

        if (extraMessage) {
            error = error.concat(` - ${extraMessage}`);
        }

        return error;
    };
}