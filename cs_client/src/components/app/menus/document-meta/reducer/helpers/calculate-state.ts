import {
  ResetToEditProps,
  TDocumentMetaState,
} from '::app/menus/document-meta/reducer/reducer';
import { Privacy } from '::types/graphql/generated';

const calculateEditedDocumentState = ({
  document: { name, privacy },
}: ResetToEditProps): TDocumentMetaState => ({
  name,
  privacy,
});
const calculateCreatedDocumentState = (): TDocumentMetaState => {
  return {
    name: 'new document',
    privacy: Privacy.PRIVATE,
  };
};

export { calculateEditedDocumentState, calculateCreatedDocumentState };
