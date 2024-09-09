import { BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';
import { JoiValidationPipe } from '../joi-validation.utils';

describe('JoiValidationPipe', () => {
  let pipe: JoiValidationPipe;

  beforeEach(() => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(0).required(),
    });

    pipe = new JoiValidationPipe(schema);
  });

  it('should return the value if validation succeeds', () => {
    const validValue = { name: 'John Doe', age: 30 };

    const result = pipe.transform(validValue);

    expect(result).toEqual(validValue);
  });

  it('should throw BadRequestException if validation fails', () => {
    const invalidValue = { name: '', age: -5 };

    try {
      pipe.transform(invalidValue);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getResponse()).toEqual({
        message: 'Validation failed',
        errors: [
          {
            message: '"name" is not allowed to be empty',
            path: 'name',
            type: 'string.empty',
          },
          {
            message: '"age" must be greater than or equal to 0',
            path: 'age',
            type: 'number.min',
          },
        ],
      });
    }
  });

  it('should throw BadRequestException for missing required fields', () => {
    const invalidValue = {};

    try {
      pipe.transform(invalidValue);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getResponse()).toEqual({
        message: 'Validation failed',
        errors: [
          { message: '"name" is required', path: 'name', type: 'any.required' },
          { message: '"age" is required', path: 'age', type: 'any.required' },
        ],
      });
    }
  });

  it('should throw BadRequestException if only one field is invalid', () => {
    const invalidValue = { name: 'John Doe', age: -5 };
    try {
      pipe.transform(invalidValue);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getResponse()).toEqual({
        message: 'Validation failed',
        errors: [
          {
            message: '"age" must be greater than or equal to 0',
            path: 'age',
            type: 'number.min',
          },
        ],
      });
    }
  });

  it('should handle complex validation errors', () => {
    const invalidValue = { name: '', age: null as null };

    try {
      pipe.transform(invalidValue);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getResponse()).toEqual({
        message: 'Validation failed',
        errors: [
          {
            message: '"name" is not allowed to be empty',
            path: 'name',
            type: 'string.empty',
          },
          {
            message: '"age" must be a number',
            path: 'age',
            type: 'number.base',
          },
        ],
      });
    }
  });
});
