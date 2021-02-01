import { filterChanges } from '::store/tasks/sync-folders/helpers/save-folders-changes/helpers/filter-changes';

const data = {
  created: ['a', 'b', 'c'],
  deleted: ['b', 'm'],
  updated: ['b', 'm', 'p'],
};
describe('sync-folders > filter-changes', function () {
  it('should filter changes correctly', function () {
    //
    const filtered = filterChanges(data);
    expect(filtered.created).toEqual(['a', 'c']);
    expect(filtered.deleted).toEqual(['m']);
    expect(filtered.updated).toEqual(['p']);
  });
});
