import { Node } from '::types/graphql/generated';

export type NodeMeta = Omit<Node, 'html' | 'image'>;
export type NodeCached = Node;
