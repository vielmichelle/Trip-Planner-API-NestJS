import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { ApiConfigsService } from '../configs/api-configs.service';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {

    constructor(private apiConfigsService: ApiConfigsService) { }

    createMongooseOptions(): MongooseModuleOptions {
        return {
            uri: `${this.apiConfigsService.dbHost}/${this.apiConfigsService.dbName}`,
        }
    }
}
