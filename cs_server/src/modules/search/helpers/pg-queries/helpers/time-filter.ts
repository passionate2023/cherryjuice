import { TimeFilter, TimeRange } from '../../../it/node-search.it';
import { Privacy } from '../../../../document/entities/document.entity';
import { NodePrivacy } from '../../../../node/it/node-meta.it';

type QueryCreatorState = {
  variables: (string | Date | Privacy| NodePrivacy)[];
};

type TimeFilterWCProps = {
  state: QueryCreatorState;
  updatedAtTimeFilter: TimeFilter;
  createdAtTimeFilter: TimeFilter;
};
const timeFilterWC = ({
  state,
  createdAtTimeFilter,
  updatedAtTimeFilter,
}: TimeFilterWCProps): string[] => {
  const query: string[] = [];
  [
    { name: 'createdAt', filter: createdAtTimeFilter },
    { name: 'updatedAt', filter: updatedAtTimeFilter },
  ].forEach(({ name, filter }) => {
    if (filter.rangeName !== TimeRange.AnyTime) {
      state.variables.push(
        `[${filter.rangeStart
          .toUTCString()
          .replace(',', '')}, ${filter.rangeEnd
          .toUTCString()
          .replace(',', '')}]`,
      );
      query.push(`$${state.variables.length}::tstzrange @> n."${name}"`);
    }
  });
  return query;
};

export { timeFilterWC };
export { TimeFilterWCProps, QueryCreatorState };
