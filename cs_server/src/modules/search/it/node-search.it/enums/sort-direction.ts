import { registerEnumType } from '@nestjs/graphql';

export enum SortDirection {
  Ascending = 'Ascending',
  Descending = 'Descending',
}
registerEnumType(SortDirection, {
  name: 'SortDirection',
});
