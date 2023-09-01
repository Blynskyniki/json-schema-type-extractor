export const schema1 = {
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'integer',
    },
    created: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['created', 'name'],
  type: 'object',
} as const;

export const schema2 = {
  type: 'array',
  items: {
    type: 'string',
  },
} as const;

export const schema3 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      userId: {
        type: 'integer',
      },
      id: {
        type: 'integer',
      },
      title: {
        type: 'string',
      },
    },
    required: ['userId', 'id', 'title'],
  },
} as const;
