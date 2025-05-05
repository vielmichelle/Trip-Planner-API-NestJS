// Defines available variables, if the variable is not defined here, the configService get method gives an error
export interface EnvironmentVariables {
    NODE_ENV: string;
    PORT: number;

    APPLICATION_NAME: string;
    APPLICATION_DESCRIPTION: string;

    LOG_LEVELS: string;

    DB_HOST: string;
    DB_NAME: string;

    TRIPS_SEARCH_RETRIEVE_API_HOST: string;
    TRIPS_SEARCH_RETRIEVE_API_ROUTE: string;
    TRIPS_SEARCH_RETRIEVE_API_KEY: string;
}