import { RequiredFields, UnwrapArray, Writeable } from './common';
import * as schemas from './__fixtures__/';

type PropsLike = {
  type: 'string' | 'integer' | 'double';
  format?: 'uuid' | 'date' | 'date-time';
  [key: string]: any;
};

type PropsDict = {
  [key: string]: PropsLike;
};

type SchemaLike<T extends SchemaLike<T>> = ObjectSchemaLike<T> | ArraySchemaLike<T>;

type BaseSchemaLike = {
  type: 'object' | 'array';
  required?: string[];
  [key: string]: any;
};

interface ObjectSchemaLike<T extends SchemaLike<T>> extends BaseSchemaLike {
  type: 'object';
  properties: PropsDict;
}

interface ArraySchemaLike<T extends SchemaLike<T>> extends BaseSchemaLike {
  type: 'array';
  items: ObjectSchemaLike<T> | { type: 'string' };
}

type extract<T extends SchemaLike<T>> = T extends ObjectSchemaLike<T>
  ? extractObject<T>
  : T extends ArraySchemaLike<T>
  ? extractArray<T>
  : unknown;

type extractObject<T extends ObjectSchemaLike<T>> = RequiredFields<
  { [K in keyof T['properties']]?: extractType<T['properties'][K]> },
  UnwrapArray<T['required']>
>;

type extractArray<T extends ArraySchemaLike<T>> = T['items'] extends ObjectSchemaLike<T>
  ? Array<extractObject<T['items']>>
  : T['items'] extends { type: 'string' }
  ? Array<string>
  : unknown;

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

type Schema1 = extract<Writeable<typeof schemas.schema1>>;
type Schema2 = extract<Writeable<typeof schemas.schema2>>;
type Schema3 = extract<Writeable<typeof schemas.schema3>>;

const example1: Schema1 = { name: '', created: new Date() };
const example2: Schema2 = [];
const example3: Schema3 = [{ userId: 1, id: 1, title: '' }];
