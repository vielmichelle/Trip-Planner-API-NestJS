import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name, { timestamp: true });

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        // If the exception contains a cause, the error must be logged
        // Because represents not desired/not managed behaviour (like a catch clause hit)
        if (exception.cause) {
            this.logger.error(exception.cause);
        }

        return response
            .status(status)
            .json(exception.getResponse());
    }
}