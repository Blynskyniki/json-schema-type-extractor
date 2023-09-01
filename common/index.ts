export type UnwrapArray<T> = T extends Array<infer R> ? R : never;

export type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };

export type RequiredFields<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Required<Pick<T, K>>;
