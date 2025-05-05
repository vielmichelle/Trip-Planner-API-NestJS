import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose-config.service';
import { ConfigsModule } from '../configs/configs.module';
import { ApiConfigsService } from '../configs/api-configs.service';
import { DatabaseService } from './database.service';

@Module({
    imports: [
        ConfigsModule,
        MongooseModule.forRootAsync({
            imports: [ConfigsModule],
            useClass: MongooseConfigService,
            inject: [ApiConfigsService],
        })
    ],
    providers: [MongooseConfigService, DatabaseService],
    exports: [DatabaseService]
})
export class DatabaseModule { }
