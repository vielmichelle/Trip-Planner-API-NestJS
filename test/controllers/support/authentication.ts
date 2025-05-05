import { LoginRequestDto } from "src/core/auth/dto/login-request.dto";
import * as request from 'supertest';

export const generateLoginRequest = () => {
    return <LoginRequestDto>{
        username: "test",
        password: "dHE1>,t1fF32"
    };
};

export const generateBearerAuthenticationHeadersWithLogin = async (httpServer: any) => {
    const loginRequest = generateLoginRequest();
    const loginResponse = await request(httpServer).post('/auth/login').send(loginRequest);

    return {
        'Authorization': `Bearer ${loginResponse.body.access_token}`
    };
}