import { Catch, ExceptionFilter, ArgumentsHost, NotFoundException, Logger, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('CustomExceptionFilter');

  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    this.logger.error(`${(exception as any).entityClass.name} Not Found`);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.NOT_FOUND;

    response.status(status).json({
      statusCode: status,
      message: `${(exception as any).entityClass.name} Not Found`,
    });
  }
}
