import { DS } from "::types/graphql/generated";

const mapEventType = (value: DS) => {
  switch (value) {
    case DS.IMPORT_PENDING:
      return 'pending';
    case DS.IMPORT_PREPARING:
      return 'uploading';
    case DS.IMPORT_STARTED:
      return 'importing';
    case DS.IMPORT_FINISHED:
      return 'finished';
    case DS.IMPORT_FAILED:
      return 'failed';
    case DS.IMPORT_DUPLICATE:
      return 'duplicate';
  }
};

export { mapEventType };
