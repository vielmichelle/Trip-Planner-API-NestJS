import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from '../../metadata';
import { INestApplication } from '@nestjs/common';
import { ApiConfigsService } from '../configs/api-configs.service';

export const configureSwagger = async (app: INestApplication<any>, apiConfigService: ApiConfigsService) => {

    // Configure plugin for create automatic documentation
    await SwaggerModule.loadPluginMetadata(metadata);

    const config = new DocumentBuilder()
        .setTitle(apiConfigService.applicationName)
        .setDescription(apiConfigService.applicationDescription)
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            description: 'Enter the Bearer Token obtained from /auth/login endpoint',
        })
        .addSecurityRequirements('bearer')
        .addGlobalResponse({
            status: 401,
            description: 'Unauthorized',
        })
        .addGlobalResponse({
            status: 500,
            description: 'Internal Server Error',
        })
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, documentFactory);
}