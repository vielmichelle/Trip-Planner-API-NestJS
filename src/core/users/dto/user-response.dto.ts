import { Exclude, Expose } from "class-transformer";
import mongoose from "mongoose";

@Exclude()
export class UserResponseDto {
    @Expose()
    _id: mongoose.Types.ObjectId;

    @Expose()
    username: string;
}