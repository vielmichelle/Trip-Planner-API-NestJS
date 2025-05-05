import { Expose } from "class-transformer";

export class TripDestinationResponseDto {
    @Expose()
    code: string;
}