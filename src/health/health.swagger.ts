export const healthApiResponse = {
  status: 200,
  description: 'Successful response',
  schema: {
    type: 'object',
    properties: {
      status: { type: 'string' },
    },
    required: ['status'],
  },
};
