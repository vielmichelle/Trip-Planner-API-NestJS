import { Module } from '@nestjs/common';
import { TripsModule } from './trips/trips.module';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AppRoutes } from './app.routes';
import { CoreModule } from './core/core.module';
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    CoreModule,
    TripsModule,
    RouterModule.register(AppRoutes)
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ]
})
export class AppModule { }
