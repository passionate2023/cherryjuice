type Props = {
  deleted: string[];
  created: string[];
  updated: string[];
};
export const filterChanges = ({ deleted, created, updated }: Props): Props => {
  const sets = {
    deleted: new Set(deleted),
    created: new Set(created),
    updated: new Set(Object.keys(updated)),
  };
  const filtered = {
    created: undefined,
    deleted: undefined,
    updated: undefined,
  };
  // deleted should not contain created
  filtered.deleted = new Set(deleted.filter(id => !sets.created.has(id)));
  // created should not contain deleted
  filtered.created = new Set(created.filter(id => !sets.deleted.has(id)));
  // updated should not contain deleted and created
  filtered.updated = new Set(
    updated.filter(id => !sets.deleted.has(id) && !sets.created.has(id)),
  );
  return {
    deleted: Array.from(filtered.deleted),
    created: Array.from(filtered.created),
    updated: Array.from(filtered.updated),
  };
};
