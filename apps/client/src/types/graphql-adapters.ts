import { Node, Document } from '@cherryjuice/graphql-types';

export type NodeMeta = Omit<Node, 'html' | 'image'>;
export type DocumentMeta = Document;
export type NodeCached = Node;

export type NodeNew = Omit<Node, 'is_empty' | 'is_richtxt' | 'image'>;
