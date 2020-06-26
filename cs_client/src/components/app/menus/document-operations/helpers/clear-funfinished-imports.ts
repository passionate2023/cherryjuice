import { DS } from '::types/graphql/generated';
import { ActiveImports } from '../import-progress';

const clearUnfinishedImports = setActiveImports => (
  activeImports: ActiveImports,
) => () => {
  const unfinishedImports = Object.fromEntries(
    Object.entries(activeImports).filter(
      ([, documentProps]) =>
        documentProps.eventType ===
          DS.IMPORT_PENDING ||
        documentProps.eventType ===
          DS.IMPORT_STARTED ||
        documentProps.eventType ===
          DS.IMPORT_PREPARING,
    ),
  );
  setActiveImports(unfinishedImports);
};

export { clearUnfinishedImports };
