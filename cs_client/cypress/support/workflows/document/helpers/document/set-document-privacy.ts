import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { Privacy } from '../../../../../../types/graphql/generated';
import { dialogs } from '../../../dialogs/dialogs';
import { UserCredentials } from '../../../../../fixtures/auth/login-credentials';

export type GuestAst = { user: UserCredentials; writeAccess: boolean };
type Options = {
  privacy: Privacy;
  guests?: GuestAst[];
};
export const setDocumentPrivacy = (
  documentAst: DocumentAst,
  { guests, privacy }: Options,
) => {
  dialogs.documentMeta.show(documentAst);
  dialogs.documentMeta.setPrivacy(privacy);
  if (guests) {
    guests.forEach(guest => {
      dialogs.documentMeta.addGuest(guest);
    });
  }
  dialogs.documentMeta.apply();
  dialogs.documentsList.close();
  documentAst.meta.privacy = privacy;
  documentAst.meta.guests.push(...guests);
};
