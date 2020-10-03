import { DocumentAst } from '../../../../../fixtures/document/generate-document';
import { Privacy } from '../../../../../../types/graphql';
import { UserCredentials } from '../../../../../fixtures/auth/login-credentials';
import { interact } from '../../../interact/interact';
import { puppeteer } from '../../puppeteer';

export type GuestAst = { user: UserCredentials; writeAccess: boolean };
type Options = {
  privacy: Privacy;
  guests?: GuestAst[];
};
export const setDocumentPrivacy = (
  documentAst: DocumentAst,
  { guests, privacy }: Options,
) => {
  interact.documentMeta.show(documentAst);
  interact.documentMeta.set.privacy(privacy);
  if (guests) {
    guests.forEach(guest => {
      puppeteer.manage.addGuest(guest);
    });
  }
  interact.documentMeta.apply();
  interact.documentsList.close();
  documentAst.meta.privacy = privacy;
  documentAst.meta.guests.push(...guests);
};
