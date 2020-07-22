import { QNodeMeta } from '::graphql/queries/query-document';

export type Function<T, U> = (a: T) => U;
export type nodesMetaMap = Map<number, QNodeMeta>;
export type GqlDataPath<U> = (data: any) => U | undefined;
