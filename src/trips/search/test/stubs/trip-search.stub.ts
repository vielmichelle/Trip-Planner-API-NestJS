import { TripsRetrieveApiResponseDto } from "src/trips/retrieve-api/dto/trips-retrieve-api-response.dto";

export const tripSearchStub = (): TripsRetrieveApiResponseDto => {
    return {
        id: "d1b89056-ae55-4040-bbd6-0373405705d4",
        type: "car",
        display_name: "from SYD to GRU by car",
        origin: "SYD",
        destination: "GRU",
        cost: 1709,
        duration: 32
    };
}