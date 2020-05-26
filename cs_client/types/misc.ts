import { NodeMeta } from '::types/graphql/adapters';

export type Function<T, U> = (a: T) => U;
export type nodesMetaMap = Map<number, NodeMeta>;
