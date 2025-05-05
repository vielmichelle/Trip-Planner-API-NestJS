import { Expose } from "class-transformer";

export class TripsSearchResponseDto {
  @Expose()
  type: string;

  @Expose()
  display_name: string;

  @Expose()
  origin: string;

  @Expose()
  destination: string;

  @Expose()
  cost: number;

  @Expose()
  duration: number;
}