// https://graphql-code-generator.com/
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type DocumentNodeArgs = {
  node_id?: Maybe<Scalars['Int']>;
};

export type Image = {
  __typename?: 'Image';
  image: Scalars['String'];
};

export type NodeImageArgs = {
  thumbnail?: Maybe<Scalars['Boolean']>;
  offset?: Maybe<Scalars['Float']>;
};

export type Query = {
  __typename?: 'Query';
  document: Array<Maybe<Document>>;
};

export type QueryDocumentArgs = {
  file_id?: Maybe<Scalars['String']>;
};

export type Node = {
  __typename?: 'Node';
  node_id: Scalars['Int'];
  name: Scalars['String'];
  father_id: Scalars['Int'];
  child_nodes: Array<Scalars['Int']>;
  is_empty: Scalars['Int'];
  is_richtxt: Scalars['Int'];
  has_image: Scalars['Int'];
  has_codebox: Scalars['Int'];
  has_table: Scalars['Int'];
  createdAt: Scalars['Float'];
  updatedAt: Scalars['Float'];
  node_title_styles: Scalars['String'];
  icon_id: Scalars['String'];
  html: Scalars['String'];
  image: Array<Maybe<Image>>;
};
export type NodeMeta = Omit<Node, 'html' | 'image'>;
export type NodeImage = Pick<Node, 'node_id' | 'image'>;
type Document = {
  __typename?: 'Document';
  id: Scalars['String'];
  name: Scalars['String'];
  size: Scalars['Int'];
  createdAt: Scalars['Float'];
  updatedAt: Scalars['Float'];
  folder?: Maybe<Scalars['String']>;
  node: Array<Maybe<Node>>;
};
export type DocumentMeta = Omit<Document, 'node'>;
