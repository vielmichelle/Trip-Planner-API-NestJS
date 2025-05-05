import { ClassSerializerContextOptions } from "@nestjs/common";

export const defaultSerializeOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    excludeExtraneousValues: true
};