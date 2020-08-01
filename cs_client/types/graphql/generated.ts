/* tslint:disable */
/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType } from 'graphql';
/**
 * This file is auto-generated by graphql-schema-typescript
 * Please note that any changes in this file may be overwritten
 */

/*******************************
 *                             *
 *          TYPE DEFS          *
 *                             *
 *******************************/
export interface Query {
  document: Array<Document | null>;
  search: SearchResultEntity;
  user: UserQuery;
}

export interface Document {
  createdAt: number;
  exportDocument: string;
  folder?: string;
  guests?: Array<DocumentGuestOt | null>;
  hash?: string;
  id: string;
  name: string;
  node: Array<Node | null>;
  privacy: Privacy;
  privateNodes: Array<PrivateNode>;
  size: number;
  status?: string;
  updatedAt: number;
  userId: string;
}

export interface DocumentGuestOt {
  accessLevel: AccessLevel;
  email: string;
  userId: string;
}

export enum AccessLevel {
  READER = 'READER',
  WRITER = 'WRITER',
}

export interface Node {
  child_nodes: Array<number>;
  createdAt: number;
  documentId: string;
  fatherId?: string;
  father_id: number;
  hash: string;
  html: string;
  id: string;
  image: Array<Image | null>;
  name: string;
  node_id: number;
  node_title_styles?: string;
  privacy?: NodePrivacy;
  read_only: number;
  updatedAt: number;
}

export interface Image {
  base64: string;
  id: string;
}

export enum NodePrivacy {
  DEFAULT = 'DEFAULT',
  GUESTS_ONLY = 'GUESTS_ONLY',
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export enum Privacy {
  GUESTS_ONLY = 'GUESTS_ONLY',
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export interface PrivateNode {
  father_id: number;
  node_id: number;
  privacy: NodePrivacy;
}

export interface SearchResultEntity {
  node: NodeSearchResults;
}

export interface NodeSearchIt {
  createdAtTimeFilter: TimeFilter;
  documentId: string;
  nodeId: string;
  query: string;
  searchOptions: SearchOptions;
  searchScope: SearchScope;
  searchTarget: Array<SearchTarget>;
  searchType: SearchType;
  sortOptions: SearchSortOptions;
  updatedAtTimeFilter: TimeFilter;
}

export interface TimeFilter {
  rangeEnd: Timestamp;
  rangeName: TimeRange;
  rangeStart: Timestamp;
}

/**
 * The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch.
 */
export type Timestamp = any;

export enum TimeRange {
  AnyTime = 'AnyTime',
  CustomRange = 'CustomRange',
  PastDay = 'PastDay',
  PastHour = 'PastHour',
  PastMonth = 'PastMonth',
  PastWeek = 'PastWeek',
  PastYear = 'PastYear',
}

export interface SearchOptions {
  caseSensitive: boolean;
  fullWord: boolean;
}

export enum SearchScope {
  allDocuments = 'allDocuments',
  childNodes = 'childNodes',
  currentDocument = 'currentDocument',
  currentNode = 'currentNode',
}

export enum SearchTarget {
  nodeContent = 'nodeContent',
  nodeTitle = 'nodeTitle',
}

export enum SearchType {
  FullText = 'FullText',
  Regex = 'Regex',
  Simple = 'Simple',
}

export interface SearchSortOptions {
  sortBy: SortNodesBy;
  sortDirection: SortDirection;
}

export enum SortNodesBy {
  CreatedAt = 'CreatedAt',
  DocumentName = 'DocumentName',
  NodeName = 'NodeName',
  UpdatedAt = 'UpdatedAt',
}

export enum SortDirection {
  Ascending = 'Ascending',
  Descending = 'Descending',
}

export interface NodeSearchResults {
  meta: SearchResultMeta;
  results: Array<NodeSearchResultEntity | null>;
}

export interface SearchResultMeta {
  elapsedTimeMs: number;
  timestamp: Timestamp;
}

export interface NodeSearchResultEntity {
  ahtmlHeadline?: string;
  ahtml_txt?: string;
  createdAt: Timestamp;
  documentId: string;
  documentName: string;
  nodeId: string;
  nodeName: string;
  nodeNameHeadline?: string;
  node_id: number;
  updatedAt: Timestamp;
}

export interface UserQuery {
  refreshToken: AuthUser;
  userExists?: string;
}

export interface AuthUser {
  secrets: Secrets;
  token: string;
  user: User;
}

export interface Secrets {
  google_api_key: string;
  google_client_id: string;
}

export interface User {
  email: string;
  email_verified: boolean;
  firstName: string;
  id: string;
  lastName: string;
  picture?: string;
  thirdPartyId?: string;
  username: string;
}

export interface Mutation {
  document: DocumentMutation;
  user: UserMutation;
}

export interface DocumentMutation {
  createDocument: string;
  deleteDocument: string;
  editDocument: string;
  node: NodeMutation;
  uploadFile: boolean;
  uploadFromGDrive: boolean;
}

export interface CreateDocumentIt {
  guests: Array<DocumentGuestIt | null>;
  name: string;
  privacy: Privacy;
}

export interface DocumentGuestIt {
  accessLevel: AccessLevel;
  email: string;
  userId: string;
}

export interface DeleteDocumentInputType {
  IDs: Array<string>;
}

export interface EditDocumentIt {
  guests?: Array<DocumentGuestIt | null>;
  name?: string;
  privacy?: Privacy;
  updatedAt: Timestamp;
}

export interface NodeMutation {
  createNode: string;
  deleteNode: string;
  editMeta: Array<string>;
  saveAHtml: string;
  uploadImage: Array<Array<string>>;
}

export interface CreateNodeIt {
  child_nodes: Array<number>;
  createdAt: Timestamp;
  fatherId?: string;
  father_id: number;
  name: string;
  node_id: number;
  node_title_styles?: string;
  privacy?: NodePrivacy;
  read_only: number;
  updatedAt: Timestamp;
}

export interface NodeMetaIt {
  child_nodes?: Array<number | null>;
  fatherId?: string;
  father_id?: number;
  is_richtxt?: number;
  name?: string;
  node_id: number;
  node_title_styles?: string;
  position?: number;
  privacy?: NodePrivacy;
  read_only?: number;
  sequence?: number;
  updatedAt: Timestamp;
}

export interface SaveHtmlIt {
  ahtml: string;
  deletedImages: Array<string | null>;
  updatedAt: Timestamp;
}

/**
 * The ImageUpload scalar type represents a file upload.
 */
export type ImageUpload = any;

/**
 * The CTBUpload scalar type represents a file upload.
 */
export type CTBUpload = any;

export interface UploadLinkInputType {
  IDs: Array<string>;
  access_token: string;
}

export interface UserMutation {
  signIn: AuthUser;
  signUp: AuthUser;
}

export interface SignInCredentials {
  emailOrUsername: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}

export interface Subscription {
  document: DocumentSubscription;
}

export interface DocumentSubscription {
  hash: string;
  id: string;
  name: string;
  status: DOCUMENT_SUBSCRIPTIONS;
}

export enum DOCUMENT_SUBSCRIPTIONS {
  DELETED = 'DELETED',
  EXPORT_FAILED = 'EXPORT_FAILED',
  EXPORT_FINISHED = 'EXPORT_FINISHED',
  EXPORT_IMAGES_STARTED = 'EXPORT_IMAGES_STARTED',
  EXPORT_NODES_STARTED = 'EXPORT_NODES_STARTED',
  EXPORT_PENDING = 'EXPORT_PENDING',
  EXPORT_PREPARING = 'EXPORT_PREPARING',
  IMPORT_DUPLICATE = 'IMPORT_DUPLICATE',
  IMPORT_FAILED = 'IMPORT_FAILED',
  IMPORT_FINISHED = 'IMPORT_FINISHED',
  IMPORT_PENDING = 'IMPORT_PENDING',
  IMPORT_PREPARING = 'IMPORT_PREPARING',
  IMPORT_STARTED = 'IMPORT_STARTED',
}

/*********************************
 *                               *
 *         TYPE RESOLVERS        *
 *                               *
 *********************************/
/**
 * This interface define the shape of your resolver
 * Note that this type is designed to be compatible with graphql-tools resolvers
 * However, you can still use other generated interfaces to make your resolver type-safed
 */
export interface Resolver {
  Query?: QueryTypeResolver;
  Document?: DocumentTypeResolver;
  DocumentGuestOt?: DocumentGuestOtTypeResolver;
  Node?: NodeTypeResolver;
  Image?: ImageTypeResolver;
  PrivateNode?: PrivateNodeTypeResolver;
  SearchResultEntity?: SearchResultEntityTypeResolver;
  Timestamp?: GraphQLScalarType;
  NodeSearchResults?: NodeSearchResultsTypeResolver;
  SearchResultMeta?: SearchResultMetaTypeResolver;
  NodeSearchResultEntity?: NodeSearchResultEntityTypeResolver;
  UserQuery?: UserQueryTypeResolver;
  AuthUser?: AuthUserTypeResolver;
  Secrets?: SecretsTypeResolver;
  User?: UserTypeResolver;
  Mutation?: MutationTypeResolver;
  DocumentMutation?: DocumentMutationTypeResolver;
  NodeMutation?: NodeMutationTypeResolver;
  ImageUpload?: GraphQLScalarType;
  CTBUpload?: GraphQLScalarType;
  UserMutation?: UserMutationTypeResolver;
  Subscription?: SubscriptionTypeResolver;
  DocumentSubscription?: DocumentSubscriptionTypeResolver;
}
export interface QueryTypeResolver<TParent = any> {
  document?: QueryToDocumentResolver<TParent>;
  search?: QueryToSearchResolver<TParent>;
  user?: QueryToUserResolver<TParent>;
}

export interface QueryToDocumentArgs {
  file_id?: string;
}
export interface QueryToDocumentResolver<TParent = any, TResult = any> {
  (
    parent: TParent,
    args: QueryToDocumentArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface QueryToSearchResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface QueryToUserResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentTypeResolver<TParent = any> {
  createdAt?: DocumentToCreatedAtResolver<TParent>;
  exportDocument?: DocumentToExportDocumentResolver<TParent>;
  folder?: DocumentToFolderResolver<TParent>;
  guests?: DocumentToGuestsResolver<TParent>;
  hash?: DocumentToHashResolver<TParent>;
  id?: DocumentToIdResolver<TParent>;
  name?: DocumentToNameResolver<TParent>;
  node?: DocumentToNodeResolver<TParent>;
  privacy?: DocumentToPrivacyResolver<TParent>;
  privateNodes?: DocumentToPrivateNodesResolver<TParent>;
  size?: DocumentToSizeResolver<TParent>;
  status?: DocumentToStatusResolver<TParent>;
  updatedAt?: DocumentToUpdatedAtResolver<TParent>;
  userId?: DocumentToUserIdResolver<TParent>;
}

export interface DocumentToCreatedAtResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToExportDocumentResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToFolderResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToGuestsResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToHashResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToNodeArgs {
  node_id?: number;
}
export interface DocumentToNodeResolver<TParent = any, TResult = any> {
  (
    parent: TParent,
    args: DocumentToNodeArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface DocumentToPrivacyResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToPrivateNodesResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToSizeResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToStatusResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToUpdatedAtResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentToUserIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentGuestOtTypeResolver<TParent = any> {
  accessLevel?: DocumentGuestOtToAccessLevelResolver<TParent>;
  email?: DocumentGuestOtToEmailResolver<TParent>;
  userId?: DocumentGuestOtToUserIdResolver<TParent>;
}

export interface DocumentGuestOtToAccessLevelResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentGuestOtToEmailResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentGuestOtToUserIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeTypeResolver<TParent = any> {
  child_nodes?: NodeToChild_nodesResolver<TParent>;
  createdAt?: NodeToCreatedAtResolver<TParent>;
  documentId?: NodeToDocumentIdResolver<TParent>;
  fatherId?: NodeToFatherIdResolver<TParent>;
  father_id?: NodeToFather_idResolver<TParent>;
  hash?: NodeToHashResolver<TParent>;
  html?: NodeToHtmlResolver<TParent>;
  id?: NodeToIdResolver<TParent>;
  image?: NodeToImageResolver<TParent>;
  name?: NodeToNameResolver<TParent>;
  node_id?: NodeToNode_idResolver<TParent>;
  node_title_styles?: NodeToNode_title_stylesResolver<TParent>;
  privacy?: NodeToPrivacyResolver<TParent>;
  read_only?: NodeToRead_onlyResolver<TParent>;
  updatedAt?: NodeToUpdatedAtResolver<TParent>;
}

export interface NodeToChild_nodesResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToCreatedAtResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToDocumentIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToFatherIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToFather_idResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToHashResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToHtmlResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToImageArgs {
  thumbnail?: boolean;
}
export interface NodeToImageResolver<TParent = any, TResult = any> {
  (
    parent: TParent,
    args: NodeToImageArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface NodeToNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToNode_idResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToNode_title_stylesResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToPrivacyResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToRead_onlyResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeToUpdatedAtResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface ImageTypeResolver<TParent = any> {
  base64?: ImageToBase64Resolver<TParent>;
  id?: ImageToIdResolver<TParent>;
}

export interface ImageToBase64Resolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface ImageToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface PrivateNodeTypeResolver<TParent = any> {
  father_id?: PrivateNodeToFather_idResolver<TParent>;
  node_id?: PrivateNodeToNode_idResolver<TParent>;
  privacy?: PrivateNodeToPrivacyResolver<TParent>;
}

export interface PrivateNodeToFather_idResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface PrivateNodeToNode_idResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface PrivateNodeToPrivacyResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface SearchResultEntityTypeResolver<TParent = any> {
  node?: SearchResultEntityToNodeResolver<TParent>;
}

export interface SearchResultEntityToNodeArgs {
  searchArgs?: NodeSearchIt;
}
export interface SearchResultEntityToNodeResolver<
  TParent = any,
  TResult = any
> {
  (
    parent: TParent,
    args: SearchResultEntityToNodeArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface NodeSearchResultsTypeResolver<TParent = any> {
  meta?: NodeSearchResultsToMetaResolver<TParent>;
  results?: NodeSearchResultsToResultsResolver<TParent>;
}

export interface NodeSearchResultsToMetaResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultsToResultsResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface SearchResultMetaTypeResolver<TParent = any> {
  elapsedTimeMs?: SearchResultMetaToElapsedTimeMsResolver<TParent>;
  timestamp?: SearchResultMetaToTimestampResolver<TParent>;
}

export interface SearchResultMetaToElapsedTimeMsResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface SearchResultMetaToTimestampResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultEntityTypeResolver<TParent = any> {
  ahtmlHeadline?: NodeSearchResultEntityToAhtmlHeadlineResolver<TParent>;
  ahtml_txt?: NodeSearchResultEntityToAhtml_txtResolver<TParent>;
  createdAt?: NodeSearchResultEntityToCreatedAtResolver<TParent>;
  documentId?: NodeSearchResultEntityToDocumentIdResolver<TParent>;
  documentName?: NodeSearchResultEntityToDocumentNameResolver<TParent>;
  nodeId?: NodeSearchResultEntityToNodeIdResolver<TParent>;
  nodeName?: NodeSearchResultEntityToNodeNameResolver<TParent>;
  nodeNameHeadline?: NodeSearchResultEntityToNodeNameHeadlineResolver<TParent>;
  node_id?: NodeSearchResultEntityToNode_idResolver<TParent>;
  updatedAt?: NodeSearchResultEntityToUpdatedAtResolver<TParent>;
}

export interface NodeSearchResultEntityToAhtmlHeadlineResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultEntityToAhtml_txtResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultEntityToCreatedAtResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultEntityToDocumentIdResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultEntityToDocumentNameResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultEntityToNodeIdResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultEntityToNodeNameResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultEntityToNodeNameHeadlineResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultEntityToNode_idResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeSearchResultEntityToUpdatedAtResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserQueryTypeResolver<TParent = any> {
  refreshToken?: UserQueryToRefreshTokenResolver<TParent>;
  userExists?: UserQueryToUserExistsResolver<TParent>;
}

export interface UserQueryToRefreshTokenResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserQueryToUserExistsArgs {
  email: string;
}
export interface UserQueryToUserExistsResolver<TParent = any, TResult = any> {
  (
    parent: TParent,
    args: UserQueryToUserExistsArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface AuthUserTypeResolver<TParent = any> {
  secrets?: AuthUserToSecretsResolver<TParent>;
  token?: AuthUserToTokenResolver<TParent>;
  user?: AuthUserToUserResolver<TParent>;
}

export interface AuthUserToSecretsResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface AuthUserToTokenResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface AuthUserToUserResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface SecretsTypeResolver<TParent = any> {
  google_api_key?: SecretsToGoogle_api_keyResolver<TParent>;
  google_client_id?: SecretsToGoogle_client_idResolver<TParent>;
}

export interface SecretsToGoogle_api_keyResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface SecretsToGoogle_client_idResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserTypeResolver<TParent = any> {
  email?: UserToEmailResolver<TParent>;
  email_verified?: UserToEmail_verifiedResolver<TParent>;
  firstName?: UserToFirstNameResolver<TParent>;
  id?: UserToIdResolver<TParent>;
  lastName?: UserToLastNameResolver<TParent>;
  picture?: UserToPictureResolver<TParent>;
  thirdPartyId?: UserToThirdPartyIdResolver<TParent>;
  username?: UserToUsernameResolver<TParent>;
}

export interface UserToEmailResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToEmail_verifiedResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToFirstNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToLastNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToPictureResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToThirdPartyIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToUsernameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface MutationTypeResolver<TParent = any> {
  document?: MutationToDocumentResolver<TParent>;
  user?: MutationToUserResolver<TParent>;
}

export interface MutationToDocumentArgs {
  file_id?: string;
}
export interface MutationToDocumentResolver<TParent = any, TResult = any> {
  (
    parent: TParent,
    args: MutationToDocumentArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface MutationToUserResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentMutationTypeResolver<TParent = any> {
  createDocument?: DocumentMutationToCreateDocumentResolver<TParent>;
  deleteDocument?: DocumentMutationToDeleteDocumentResolver<TParent>;
  editDocument?: DocumentMutationToEditDocumentResolver<TParent>;
  node?: DocumentMutationToNodeResolver<TParent>;
  uploadFile?: DocumentMutationToUploadFileResolver<TParent>;
  uploadFromGDrive?: DocumentMutationToUploadFromGDriveResolver<TParent>;
}

export interface DocumentMutationToCreateDocumentArgs {
  document: CreateDocumentIt;
}
export interface DocumentMutationToCreateDocumentResolver<
  TParent = any,
  TResult = any
> {
  (
    parent: TParent,
    args: DocumentMutationToCreateDocumentArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface DocumentMutationToDeleteDocumentArgs {
  documents: DeleteDocumentInputType;
}
export interface DocumentMutationToDeleteDocumentResolver<
  TParent = any,
  TResult = any
> {
  (
    parent: TParent,
    args: DocumentMutationToDeleteDocumentArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface DocumentMutationToEditDocumentArgs {
  meta: EditDocumentIt;
}
export interface DocumentMutationToEditDocumentResolver<
  TParent = any,
  TResult = any
> {
  (
    parent: TParent,
    args: DocumentMutationToEditDocumentArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface DocumentMutationToNodeArgs {
  node_id?: number;
}
export interface DocumentMutationToNodeResolver<TParent = any, TResult = any> {
  (
    parent: TParent,
    args: DocumentMutationToNodeArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface DocumentMutationToUploadFileArgs {
  files: Array<CTBUpload>;
}
export interface DocumentMutationToUploadFileResolver<
  TParent = any,
  TResult = any
> {
  (
    parent: TParent,
    args: DocumentMutationToUploadFileArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface DocumentMutationToUploadFromGDriveArgs {
  file: UploadLinkInputType;
}
export interface DocumentMutationToUploadFromGDriveResolver<
  TParent = any,
  TResult = any
> {
  (
    parent: TParent,
    args: DocumentMutationToUploadFromGDriveArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface NodeMutationTypeResolver<TParent = any> {
  createNode?: NodeMutationToCreateNodeResolver<TParent>;
  deleteNode?: NodeMutationToDeleteNodeResolver<TParent>;
  editMeta?: NodeMutationToEditMetaResolver<TParent>;
  saveAHtml?: NodeMutationToSaveAHtmlResolver<TParent>;
  uploadImage?: NodeMutationToUploadImageResolver<TParent>;
}

export interface NodeMutationToCreateNodeArgs {
  meta: CreateNodeIt;
}
export interface NodeMutationToCreateNodeResolver<
  TParent = any,
  TResult = any
> {
  (
    parent: TParent,
    args: NodeMutationToCreateNodeArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface NodeMutationToDeleteNodeResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface NodeMutationToEditMetaArgs {
  meta: Array<NodeMetaIt>;
}
export interface NodeMutationToEditMetaResolver<TParent = any, TResult = any> {
  (
    parent: TParent,
    args: NodeMutationToEditMetaArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface NodeMutationToSaveAHtmlArgs {
  data: SaveHtmlIt;
}
export interface NodeMutationToSaveAHtmlResolver<TParent = any, TResult = any> {
  (
    parent: TParent,
    args: NodeMutationToSaveAHtmlArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface NodeMutationToUploadImageArgs {
  images: Array<ImageUpload>;
}
export interface NodeMutationToUploadImageResolver<
  TParent = any,
  TResult = any
> {
  (
    parent: TParent,
    args: NodeMutationToUploadImageArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface UserMutationTypeResolver<TParent = any> {
  signIn?: UserMutationToSignInResolver<TParent>;
  signUp?: UserMutationToSignUpResolver<TParent>;
}

export interface UserMutationToSignInArgs {
  credentials: SignInCredentials;
}
export interface UserMutationToSignInResolver<TParent = any, TResult = any> {
  (
    parent: TParent,
    args: UserMutationToSignInArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface UserMutationToSignUpArgs {
  credentials: SignUpCredentials;
}
export interface UserMutationToSignUpResolver<TParent = any, TResult = any> {
  (
    parent: TParent,
    args: UserMutationToSignUpArgs,
    context: any,
    info: GraphQLResolveInfo,
  ): TResult;
}

export interface SubscriptionTypeResolver<TParent = any> {
  document?: SubscriptionToDocumentResolver<TParent>;
}

export interface SubscriptionToDocumentArgs {
  userId: string;
}
export interface SubscriptionToDocumentResolver<TParent = any, TResult = any> {
  resolve?: (
    parent: TParent,
    args: SubscriptionToDocumentArgs,
    context: any,
    info: GraphQLResolveInfo,
  ) => TResult;
  subscribe: (
    parent: TParent,
    args: SubscriptionToDocumentArgs,
    context: any,
    info: GraphQLResolveInfo,
  ) => AsyncIterator<TResult>;
}

export interface DocumentSubscriptionTypeResolver<TParent = any> {
  hash?: DocumentSubscriptionToHashResolver<TParent>;
  id?: DocumentSubscriptionToIdResolver<TParent>;
  name?: DocumentSubscriptionToNameResolver<TParent>;
  status?: DocumentSubscriptionToStatusResolver<TParent>;
}

export interface DocumentSubscriptionToHashResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentSubscriptionToIdResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentSubscriptionToNameResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface DocumentSubscriptionToStatusResolver<
  TParent = any,
  TResult = any
> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}
