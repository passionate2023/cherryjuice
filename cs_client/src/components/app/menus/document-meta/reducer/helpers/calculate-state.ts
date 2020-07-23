import {
  ResetToCreateProps,
  ResetToEditProps,
  TDocumentMetaState,
} from '::app/menus/document-meta/reducer/reducer';
import { OwnershipLevel } from '::types/graphql/generated';

const calculateEditedDocumentState = ({
  document: { name, owner },
}: ResetToEditProps): TDocumentMetaState => ({
  name,
  owner,
});
const calculateCreatedDocumentState = ({
  userId,
}: ResetToCreateProps): TDocumentMetaState => {
  return {
    name: 'new document',
    owner: {
      userId,
      public: false,
      ownershipLevel: OwnershipLevel.OWNER,
    },
  };
};

export { calculateEditedDocumentState, calculateCreatedDocumentState };
