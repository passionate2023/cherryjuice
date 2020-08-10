import {
  ResetToEditProps,
  TDocumentMetaState,
} from '::root/components/app/components/menus/dialogs/document-meta/reducer/reducer';
import { Privacy } from '::types/graphql/generated';

const calculateEditedDocumentState = ({
  document: { name, privacy, guests },
}: ResetToEditProps): TDocumentMetaState => ({
  name,
  privacy,
  guests: guests || [],
});
const calculateCreatedDocumentState = (): TDocumentMetaState => {
  return {
    name: 'new document',
    privacy: Privacy.PRIVATE,
    guests: [],
  };
};

export { calculateEditedDocumentState, calculateCreatedDocumentState };
