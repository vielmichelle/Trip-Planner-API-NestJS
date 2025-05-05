import { CacheInterceptor } from '@nestjs/cache-manager';
import { ClassSerializerInterceptor, Controller, Get, NotFoundException, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripOriginResponseDto } from './common/dto/trip-origin-response.dto';
import { TripDestinationResponseDto } from './common/dto/trip-destination-response.dto';
import { plainToInstance } from 'class-transformer';
import { defaultSerializeOptions } from 'src/common/utils/serialize.utils';

@Controller()
export class TripsController {

    constructor(private tripsService: TripsService) { }

    /**
     * List of all trips origins ordered alphabetically. 
     * 
     * @remarks 
     * Bearer token requested for authentication. <br>
     * Caching is used for this response.
     */
    @Get('origins')
    @UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
    @SerializeOptions(defaultSerializeOptions)
    async getOrigins(): Promise<TripOriginResponseDto[]> {
        return plainToInstance(TripOriginResponseDto, await this.tripsService.getOrigins());
    }

    /**
     * List of all trips destinations ordered alphabetically. 
     * 
     * @remarks 
     * Bearer token requested for authentication. <br>
     * Caching is used for this response.
     */
    @Get('destinations')
    @UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
    @SerializeOptions(defaultSerializeOptions)
    async getDestinations(): Promise<TripDestinationResponseDto[]> {
        return plainToInstance(TripDestinationResponseDto, await this.tripsService.getDestinations());
    }
}
