import * as joi from 'joi';

export const SendEmailSchema = joi.object({
  to: joi.string().required(),
  subject: joi.string().required(),
  template: joi.string().required(),
  data: joi.any().required(),
});
