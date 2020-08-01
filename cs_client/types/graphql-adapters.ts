import { Node, Document } from '::types/graphql/generated';

export type NodeMeta = Omit<Node, 'html' | 'image'>;
export type DocumentMeta = Document;
export type NodeCached = Node;

export type NodeNew = Omit<Node, 'is_empty' | 'is_richtxt' | 'image'>;
export type NodeHtml = Pick<Node, 'html' | 'node_id'>;
