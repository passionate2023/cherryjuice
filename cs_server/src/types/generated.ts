export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Ct_File = {
  __typename?: 'Ct_file';
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  fileCreation?: Maybe<Scalars['Float']>;
  fileContentModification?: Maybe<Scalars['Float']>;
  fileAttributesModification?: Maybe<Scalars['Float']>;
  fileAccess?: Maybe<Scalars['Float']>;
  slug?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  filePath?: Maybe<Scalars['String']>;
};

export type Ct_Node_Content = {
  __typename?: 'Ct_node_content';
  html?: Maybe<Scalars['String']>;
  png_thumbnail_base64?: Maybe<Scalars['String']>;
  png_full_base64?: Maybe<Scalars['String']>;
};

export type Ct_Node_ContentPng_Thumbnail_Base64Args = {
  offset: Scalars['Int'];
};

export type Ct_Node_ContentPng_Full_Base64Args = {
  offset: Scalars['Int'];
};

export type Ct_Node_Meta = {
  __typename?: 'Ct_node_meta';
  node_id?: Maybe<Scalars['Int']>;
  father_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  child_nodes?: Maybe<Array<Maybe<Scalars['Int']>>>;
  is_empty?: Maybe<Scalars['Int']>;
  is_richtxt?: Maybe<Scalars['Int']>;
  has_image?: Maybe<Scalars['Int']>;
  has_codebox?: Maybe<Scalars['Int']>;
  has_table?: Maybe<Scalars['Int']>;
  ts_creation?: Maybe<Scalars['Float']>;
  ts_lastsave?: Maybe<Scalars['Float']>;
  node_title_styles?: Maybe<Scalars['String']>;
  icon_id?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  ct_files?: Maybe<Array<Maybe<Ct_File>>>;
  ct_node_meta?: Maybe<Array<Maybe<Ct_Node_Meta>>>;
  ct_node_content?: Maybe<Array<Maybe<Ct_Node_Content>>>;
};

export type QueryCt_FilesArgs = {
  file_id?: Maybe<Scalars['String']>;
};

export type QueryCt_Node_MetaArgs = {
  file_id: Scalars['String'];
  node_id?: Maybe<Scalars['Int']>;
};

export type QueryCt_Node_ContentArgs = {
  file_id: Scalars['String'];
  node_id: Scalars['Int'];
};
