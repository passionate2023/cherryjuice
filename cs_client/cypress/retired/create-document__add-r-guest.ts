import { generateDocuments } from '../../fixtures/document/generate-documents';
import { puppeteer } from '../../support/workflows/document/puppeteer';
import { Privacy } from '../../../types/graphql/generated';
import { users } from '../../fixtures/auth/login-credentials';
import { assert } from '../../support/assertions/assertions';
import { tn } from '../../support/workflows/tests-names';
import { inspect } from '../../support/inspect/inspect';

const bootstrap = () => {
  const documentAsts = generateDocuments({
    numberOfDocuments: 3,
    treeConfig: {
      includeText: false,
      nodesPerLevel: [[1]],
      randomStyle: false,
    },
  });
  const documentsPrivacy = [
    {
      privacy: Privacy.PUBLIC,
      guests: [{ user: users.user1, writeAccess: false }],
    },
    {
      guests: [
        { user: users.user1, writeAccess: false },
        { user: users.user2, writeAccess: true },
      ],
      privacy: Privacy.GUESTS_ONLY,
    },
  ];
  documentsPrivacy.forEach(({ privacy, guests }, i) => {
    documentAsts[i].meta.guests = guests;
    documentAsts[i].meta.privacy = privacy;
  });
  return { docAsts: documentAsts, documentsPrivacy };
};

describe.skip('create document > add read guest', () => {
  const { docAsts, documentsPrivacy } = bootstrap();
  before(() => {
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.deleteDocuments([], true);
  });

  docAsts.forEach(docAst => {
    it(tn.p.createDocument(docAst), () => {
      puppeteer.manage.createDocument(docAst);
    });
  });

  docAsts
    .filter(docAst => docAst.meta.privacy !== Privacy.PRIVATE)
    .forEach(docAst => {
      it(tn.setDocPriv(docAst), () => {
        puppeteer.manage.setDocumentPrivacy(docAst, {
          privacy: docAst.meta.privacy,
          guests: docAst.meta.guests,
        });
      });
    });

  it(tn.p.saveDocuments(), () => {
    puppeteer.manage.saveDocument(docAsts);
    inspect.assignDocumentHashAndIdToAst(docAsts);
  });
  docAsts.forEach((docAst, i) => {
    it(tn.a.documentPrivacy(docAst, documentsPrivacy[i]?.privacy), () => {
      assert.documentPrivacy(docAst);
    });
  });
  docAsts.forEach(docAst => {
    docAst.meta.guests.forEach(guest => {
      it(tn.docIsAvaiToGuest(docAst, guest), () => {
        assert.documentIsAvailableToGuest(docAst, guest);
      });
      const userDocAsts = docAsts.filter(docAst =>
        docAst.meta.guests
          .map(guest => guest.user.username)
          .includes(guest.user.username),
      );
      it(tn.docsAreAvaiToGuest(userDocAsts.length, guest), () => {
        assert.guestHasTheRightDocuments(userDocAsts.length, guest.user);
      });
    });
  });
});
