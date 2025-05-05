import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TripOriginDocument = HydratedDocument<TripOrigin>;

@Schema()
export class TripOrigin {

    _id?: mongoose.Types.ObjectId;

    @Prop({ required: true })
    code: string;
}

export const TripOriginSchema = SchemaFactory.createForClass(TripOrigin);