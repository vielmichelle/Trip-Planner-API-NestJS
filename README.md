<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Trip Planner Description

**Trip Planner** is a basic [Nest](https://github.com/nestjs/nest) application **REST API** that allows to search a trip from an origin to a destination with the possibility to sort and limit the results. The API use a Mongo database and depends on an external API to retrieve the trips.

The API expose the following endpoints:
- POST /api/v1/auth/login - Given username and password, if valid returns a bearer token to authorize the other routes
- GET /api/v1/trips/origins - Returns the array of available origins that can be used to search the trips
- GET /api/v1/trips/destinations - Returns the array of available destinations that can be used to search the trips
- GET /api/v1/trips/search/sorting - Returns the array of available sorting options that can be used to sort the trips
- GET /api/v1/trips/search - Passing origin and destination, retrieves the available results (if any) from a 3rd party API and returns the results sorted and limited

The POST /login route validate username and password from users saved on the database.

The three GET /origins /destinations and /sorting requests are exposed for giving the available values dinamically to a frontend app and should be integrated with other useful informations like localized descriptions.

The GET /search use query parameters to set origin, destination, sort_by and limit, only the first two values are mandatory, while the latter have default values if not provided (Fastest and 5 respectively). Values that do not respect the costraints return detailed errors.
Not all combinations of origin and destination return trips, so for this cases a 404 error is returned. 
For any other issue regarding the 3rd party API a 503 error is returned, with a basic description of the issue (more detail informations about the error are logged).

**On application startup the database is seeded with test users, trip origins and trip destinations.**

## Architecture
The architecture structure is based on the key concepts of the following article [NestJS and Project Structure](https://dev.to/smolinari/nestjs-and-project-structure-what-to-do-1223) as it seemed an approach that best suited Nest modularity.

#### root folder
- **environments** folder should contain .env files based on the environments we are working on
- **src** contains the main application
- **test** contains integration tests with dedicated configurations
- **configuration files** all required files to run and configure the application like package.json, nest-cli.json, ecc.

#### src folder
- **common** module contains all shared/configurations modules and functions. Database, Configs and Swagger modules are exported and configured inside the common.module that is imported on the AppModule, so all the setups are available inside the application but divided in their own modules. Inside this module are also stored some global/shared filters, interceptors and utils.
- **core** module contains users and authentication, including passport guards/strategies and testing users seeding.
- **trips and other resources** the remaining folders inside src are all available HTTP resources/controllers modules like the **trips** example. 
Every resource can contain other sub-resources and common modules/utilities. For simplifying the routing in case of nested resources, there are some .routes.ts files to dinamically create and export the module routing tree, maintaining the isolation.

#### unit tests
For the scope of this small application, the **spec.ts** files are grouped inside **test** folders on the same level of the corrisponding _to be tested_ file. This helped searching the files while coding.

The **test** folders could contain a **stubs** folder with mocked entities or a **support** folder for other helping utils during testing. 

The folder **\_\_mocks\_\_** contains mocked services. This folder must be placed at the same level of the mocked service.
Inside the **spec.ts** file, should be added an import like this ``jest.mock('../trips.service');`` to inject the mocked service instead of the original one.

## Caching
The GET endpoins results are cached in memory, particularly for the search endpoint that communicates with an external API and is prone to rate limiting errors.
The cached responses with applied class-transformer serialization returns empty objects if the interceptors are ordered improperly. The ClassSerializerInterceptor should run in the end because it was configured with excludeAll strategy.

``
@UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
@SerializeOptions(defaultSerializeOptions)
``

## Open API 
Swagger documentation is available when the application is running on [/swagger endpoint](http://localhost:3011/swagger).

The documentation is partially automatically generated by the Swagger CLI Plugin, this avoids a lot of repetitive code like @ApiProperty() on all the dtos, saving time with a cleaner code. Is still possible to add the decorators and modify the standard behaviour, however it seems the plugin is not well integrated with Nest and can give some troubles with class-validator and class-tranformer when the swagger decorators are added to customize the documentation. 

## Project setup

Install node_modules
```bash
$ npm install
```
Create an environments folder on the root path, copy inside the environment file development.env.

Copy inside root/test/support the setup-environment-variables.ts file for the integration tests.

Eventually change needed variables like application port or database host and name.

## Compile and run the project

```bash
port set 3011 to avoid sharing the standard port with other applications

# build
$ npm run build

# development start
$ npm run start

# development watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```