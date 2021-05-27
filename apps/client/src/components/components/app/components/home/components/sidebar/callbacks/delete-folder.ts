import { ac, store } from '::store/store';
import { getDocumentsList } from '::store/selectors/cache/document/document';

type Props = {
  folderId: string;
  draftsFolderId: string;
};

export const deleteFolder = ({ folderId: id, draftsFolderId }: Props) => {
  ac.home.removeFolder({ id });
  const documents = getDocumentsList(store.getState()).filter(
    document => document.folder === id,
  );
  documents.forEach(document => {
    ac.documentCache.mutateDocument(
      {
        documentId: document.id,
        meta: { folder: draftsFolderId },
      },
      { dontAddToTimeline: true },
    );
  });
};
