import { ClassSerializerInterceptor, Controller, Get, Query, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { TripsSearchService } from './trips-search.service';
import { TripsSearchFindAllQuery } from './dto/query/trips-search-find-all.query';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TripsSearchResponseDto } from './dto/trips-search-response.dto';
import { plainToInstance } from 'class-transformer';
import { defaultSerializeOptions } from 'src/common/utils/serialize.utils';

@ApiTags('Trips Search')
@Controller()
export class TripsSearchController {

    constructor(private searchService: TripsSearchService) { }

    /**
     * List of all the available sorting options for /trips/search enpoint.
     * 
     * @remarks 
     * Bearer token requested for authentication. <br>
     * Caching is used for this response. <br>
     */
    @Get('sorting')
    @UseInterceptors(CacheInterceptor)
    getSortingOptions(): string[] {
        return this.searchService.getSortingOptions();
    }

    /**
     * List of all the found sorted trips.
     * 
     * @remarks 
     * Bearer token requested for authentication. <br>
     * Caching is used for this response.
     */
    @Get()
    @ApiOkResponse({ type: [TripsSearchResponseDto] })
    @ApiResponse({ status: 400, description: "Validation Error" })
    @ApiResponse({ status: 404, description: "No results found for origin and destination provided" })
    @ApiResponse({ status: 503, description: "External Service Unavailable" })
    @UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
    @SerializeOptions(defaultSerializeOptions)
    async findAll(@Query() query: TripsSearchFindAllQuery): Promise<TripsSearchResponseDto[]> {

        let trips = await this.searchService.searchTrips(
            query.origin,
            query.destination,
            query.sort_by,
            query.limit);

        return plainToInstance(TripsSearchResponseDto, trips);
    }
}
