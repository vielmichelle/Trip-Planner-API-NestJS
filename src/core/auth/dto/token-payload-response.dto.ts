import { Expose } from "class-transformer";

export class TokenPayloadResponseDto {
    @Expose()
    sub: string;

    @Expose()
    username: string;
}