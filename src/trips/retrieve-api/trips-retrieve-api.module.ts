import { Module } from '@nestjs/common';
import { TripsRetrieveApiService } from './trips-retrieve-api.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigsModule } from '../../common/configs/configs.module';

@Module({
  imports: [
    HttpModule,
    ConfigsModule
  ],
  providers: [TripsRetrieveApiService],
  exports: [TripsRetrieveApiService]
})
export class TripsRetrieveApiModule {}
