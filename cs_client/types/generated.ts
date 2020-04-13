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

export type Document = {
  __typename?: 'Document';
  document_meta: DocumentMeta;
  node_meta: Array<NodeMeta>;
  node_content: Array<NodeContent>;
};

export type DocumentNode_ContentArgs = {
  node_id: Scalars['Int'];
};

export type DocumentMeta = {
  __typename?: 'DocumentMeta';
  name: Scalars['String'];
  size: Scalars['Int'];
  fileCreation: Scalars['Float'];
  fileContentModification: Scalars['Float'];
  fileAttributesModification: Scalars['Float'];
  fileAccess: Scalars['Float'];
  slug: Scalars['String'];
  id: Scalars['String'];
  filePath: Scalars['String'];
  fileFolder: Scalars['String'];
};

export type NodeContent = {
  __typename?: 'NodeContent';
  node_id: Scalars['Int'];
  html: Scalars['String'];
  png_thumbnail: Array<Scalars['String']>;
  png: Array<Scalars['String']>;
};

export type NodeContentPng_ThumbnailArgs = {
  offset?: Maybe<Scalars['Float']>;
};

export type NodeContentPngArgs = {
  offset?: Maybe<Scalars['Float']>;
};

export type NodeMeta = {
  __typename?: 'NodeMeta';
  node_id: Scalars['Int'];
  name: Scalars['String'];
  father_id: Scalars['Int'];
  child_nodes: Array<Scalars['Int']>;
  is_empty: Scalars['Int'];
  is_richtxt: Scalars['Int'];
  has_image: Scalars['Int'];
  has_codebox: Scalars['Int'];
  has_table: Scalars['Int'];
  ts_creation: Scalars['Float'];
  ts_lastsave: Scalars['Float'];
  node_title_styles: Scalars['String'];
  icon_id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  document: Array<Document>;
};

export type QueryDocumentArgs = {
  file_id?: Maybe<Scalars['String']>;
};
