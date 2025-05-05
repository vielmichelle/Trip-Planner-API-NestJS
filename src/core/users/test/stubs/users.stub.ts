import mongoose from "mongoose"
import { User } from "../../schemas/user.schema"
import { seedUsers } from "../../seeders/users-seed"

export const userStub = (): User => {
    return {
        _id: new mongoose.Types.ObjectId('681254b8f2fc82cd3513a4f6'),
        username: 'test',
        passwordHash: '$2b$10$CMR0BCYhEgmmlvUeGz/qZ.NUXyNIG5KOsxZD.HUeFM1WuBZsc6Ffi'
    };
}

export const usersSeedStub = async (): Promise<User[]> => {
    return await Promise.all(seedUsers.map(async user => <User>{
        _id: new mongoose.Types.ObjectId(),
        username: user.username
    }));
}

export const userSeedWithPasswordHashStub = (): User => {
    return {
        username: "test",
        passwordHash: "$2b$10$RRae0AmwaWMwL6tKBTSas.loFDpSLUGQLSNF1kcuzRLNCjwqM9O4C"
    };
}

export const usersPasswordsSeedStub = (): any[] => {
    return seedUsers;
}