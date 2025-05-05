import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    _id?: mongoose.Types.ObjectId;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);