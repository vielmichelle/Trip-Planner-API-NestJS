import { TripsRetrieveApiResponseDto } from "src/trips/retrieve-api/dto/trips-retrieve-api-response.dto";

export const tripsRetrieveApiStub = (): TripsRetrieveApiResponseDto[] => {
    return [
        {
            id: "d1b89056-ae55-4040-bbd6-0373405705d4",
            type: "car",
            display_name: "from SYD to GRU by car",
            origin: "SYD",
            destination: "GRU",
            cost: 1709,
            duration: 32
        },
        {
            id: "a749c866-7928-4d08-9d5c-a6821a583d1a",
            type: "flight",
            display_name: "from SYD to GRU by flight",
            origin: "SYD",
            destination: "GRU",
            cost: 625,
            duration: 5
        },
        {
            id: "00401bc6-ffb5-4340-85a6-e3725bb6dd3e",
            type: "car",
            display_name: "from SYD to GRU by car",
            origin: "SYD",
            destination: "GRU",
            cost: 2386,
            duration: 7
        }
    ];
}