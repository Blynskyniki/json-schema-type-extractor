import { UnwrapArray } from './common';
import * as JSONDATA from './__fixtures__/object-schema.json';

const schema1 = {
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
  required: ['name'],
  type: 'object',
} as const;

const schema2 = {
  type: 'array',
  items: {
    type: 'string',
  },
} as const;

const schema3 = {
  type: 'array',
  items: {
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
    required: ['name'],
    type: 'object',
  },
} as const;

type PropsLike = {
  type: 'string' | 'integer' | 'double';
  format?: 'uuid' | 'date' | 'date-time';
  [key: string]: any;
};
type PropsDict = {
  [key: string]: PropsLike;
};
type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };
type SchemaLike<T extends SchemaLike<T> | unknown> = {
  properties: PropsDict;
  type: 'object' | 'array';
  [key: string]: any;
  required?: string[];
};
type extract<T extends SchemaLike<T>> = T['type'] extends 'object' ? extractMap<T> : unknown;

type onlyRequired<T extends SchemaLike<T>> = {
  [P in UnwrapArray<T['required']>]: T['properties'][P];
};

type extractMap<T extends SchemaLike<T>, Q = onlyRequired<T>> = {
  [K in keyof Q]: extractType<Q[K]>;
} & {
  [K in keyof T['properties']]?: extractType<T['properties'][K]>;
};

type extractType<T extends PropsLike | unknown> = T extends PropsLike
  ? T['type'] extends 'string'
    ? T['format'] extends 'date'
      ? Date
      : T['format'] extends 'date-time'
      ? Date
      : string
    : T['type'] extends 'integer'
    ? number
    : T['type'] extends 'double'
    ? string
    : T['type'] extends 'boolean'
    ? boolean
    : unknown
  : unknown;

type exampleSchema1 = extract<Writeable<typeof schema1>>;

type exampleSchema2 = UnwrapArray<Writeable<(typeof schema1)['required']>>;
type exampleSchemaJSON = UnwrapArray<Writeable<(typeof JSONDATA)['required']>>; // must be "name"
