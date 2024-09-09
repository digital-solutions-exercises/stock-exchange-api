import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  private readonly logger = new Logger(JoiValidationPipe.name);

  transform(value: any) {
    const { error } = this.schema.validate(value, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path.join('.'),
        type: detail.type,
      }));

      this.logger.error('Validation failed', errorMessages);

      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    return value;
  }
}
