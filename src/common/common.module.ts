import { Module } from '@nestjs/common';
import { ConfigsModule } from './configs/configs.module';
import { DatabaseModule } from './database/database.module';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
    imports: [
        ConfigsModule,
        DatabaseModule,
        SwaggerModule
    ]
})
export class CommonModule { }
