import mongoose from "mongoose";
import { LoginResponseDto } from "../../dto/login-response.dto";
import { UserResponseDto } from "src/core/users/dto/user-response.dto";

export const userResponseDtoStub = (): UserResponseDto => {
    return {
        _id: new mongoose.Types.ObjectId('681254b8f2fc82cd3513a4f6'),
        username: 'test'
    };
}

export const loginResponseStub = (): LoginResponseDto => {
    return {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODEyNTRiOGYyZmM4MmNkMzUxM2E0ZjYiLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3NDYzODUwODksImV4cCI6MTc0NjM4ODY4OX0.DLbPjx-T6YDkDSxhdTLrNtQ-1Ih6B6xIIhN0V30ddQM"
    };
}