import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TripDestinationDocument = HydratedDocument<TripDestination>;

@Schema()
export class TripDestination {

    _id?: mongoose.Types.ObjectId;

    @Prop({ required: true })
    code: string;
}

export const TripDestinationSchema = SchemaFactory.createForClass(TripDestination);