import { Expose } from "class-transformer";

export class TripOriginResponseDto {
    @Expose()
    code: string;
}