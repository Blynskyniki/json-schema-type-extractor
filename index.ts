const schema = {
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
const s = {
  type: 'array',
  items: {
    type: 'string',
  },
} as const;

const s2 = {
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
type SchemaLike<T extends SchemaLike<T>> = {
  properties: PropsDict;
  type: 'object' | 'array';
  [key: string]: any;
  required?: string[];
};
type extract<T extends SchemaLike<T>> = T['type'] extends 'object' ? extractMap<T> : unknown;
type onlyRequired<T extends SchemaLike<T>, KEYS extends keyof T['properties'] = keyof T['properties']> = {
  [K in KEYS]: K extends T['required'] ? T['properties'][K] : unknown;
};

type extractMap<T extends SchemaLike<T>, Q = onlyRequired<T>['properties']> = {
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

type Schema = Writeable<typeof schema>;
type qqq = extract<Schema>;

const test1: qqq = {};
