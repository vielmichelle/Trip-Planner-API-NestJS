import { IsAlpha, IsDefined, IsEnum, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { TripsSearchSortingEnum } from "../enums/trips-search-sorting.enum";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TripsSearchFindAllQuery {

    /**
     * Trip origin - Find available values from /trips/origins
     */
    @ApiProperty()
    @IsDefined()
    @IsString()
    @IsAlpha()
    @Length(3, 3, { message: 'Origin must be exactly 3 characters' })
    origin: string;

    /**
     * Trip destination - Find available values from /trips/destinations
     */
    @ApiProperty()
    @IsDefined()
    @IsString()
    @IsAlpha()
    @Length(3, 3, { message: 'Origin must be exactly 3 characters' })
    destination: string;

    /**
     * Trips sorting order - Find available values from /trips/search/sorting
     */
    @ApiPropertyOptional({
        enum: TripsSearchSortingEnum,
        default: TripsSearchSortingEnum.Fastest
    })
    @IsOptional()
    @IsEnum(TripsSearchSortingEnum)
    sort_by: TripsSearchSortingEnum = TripsSearchSortingEnum.Fastest;

    /**
     * Trips results limit
     */
    @ApiPropertyOptional({
        default: 5
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(20) // Maximum of results considered relevant 
    @Type(() => Number)
    limit: number = 5;
}