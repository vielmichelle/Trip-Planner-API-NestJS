import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name, { timestamp: true });

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const [req] = context.getArgs();

        return next
            .handle()
            .pipe(
                tap(() => this.logRequest(req.method, req.url, now)),
                catchError((err) => {
                    this.logRequest(req.method, req.url, now);
                    throw err; // Re-throw the error so it can be handled by the exception filter
                }),
            );
    }

    private logRequest = (method: string, url: string, now: number) =>
        this.logger.log(`${method} ${url} ${Date.now() - now}ms`);
}