import { Module } from '@nestjs/common';
import { TripsSearchController } from './trips-search.controller';
import { TripsSearchService } from './trips-search.service';
import { TripsRetrieveApiModule } from '../retrieve-api/trips-retrieve-api.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [TripsSearchController],
  imports: [
    TripsRetrieveApiModule,
    CacheModule.register()
  ],
  providers: [TripsSearchService],
})
export class TripsSearchModule { }
