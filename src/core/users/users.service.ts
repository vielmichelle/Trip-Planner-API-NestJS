import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async findByUsername(username: string): Promise<User | null> {
        return await this.userModel.findOne({ username: username }).exec();
    }
}