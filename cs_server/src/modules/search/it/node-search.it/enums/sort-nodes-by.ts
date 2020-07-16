import { registerEnumType } from '@nestjs/graphql';

export enum SortNodesBy {
  CreatedAt = 'CreatedAt',
  UpdatedAt = 'UpdatedAt',
  DocumentName = 'DocumentName',
  NodeName = 'NodeName',
}
registerEnumType(SortNodesBy, {
  name: 'SortNodesBy',
});
