import { Model, RootFilterQuery } from "mongoose";

export const createIfNotExists = async <Entity>(entityModel: Model<Entity>, entity: Entity, existsFilter: RootFilterQuery<Entity>) => {
    let exists = await entityModel.exists(existsFilter);

    if (!exists) {
        return await entityModel.create(entity);
    }
}