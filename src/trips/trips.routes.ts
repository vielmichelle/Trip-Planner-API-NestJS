import { TripsSearchModule } from "./search/trips-search.module";
import { TripsModule } from "./trips.module";

export const TripsRoutes = 
{
    path: 'trips',
    module: TripsModule,
    children: [
        {
            path: 'search',
            module: TripsSearchModule,
        }
    ],
};