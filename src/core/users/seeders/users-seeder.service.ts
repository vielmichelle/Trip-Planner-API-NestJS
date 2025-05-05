import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { createIfNotExists } from 'src/common/utils/seed.utils';
import { seedUsers } from './users-seed';

@Injectable()
export class UsersSeederService {
    private readonly logger = new Logger(UsersSeederService.name, { timestamp: true });

    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async onModuleInit() {
        await this.seedUsers();
    }

    private async seedUsers() {
        try {

            this.logger.log("Users Seeeding in progress...");

            for (let seedUser of seedUsers) {
                const saltOrRounds = await bcrypt.genSalt();
                const user: User = {
                    username: seedUser.username,
                    passwordHash: await bcrypt.hash(seedUser.password, saltOrRounds)
                }

                await createIfNotExists(this.userModel, user, { username: user.username });
            }

            this.logger.log("Users Seeeding completed");

        } catch (error) {
            this.logger.error(`Error occured during Users Seeding - ${error.message}`);
        }
    }
}