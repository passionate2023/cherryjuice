import { generateDocuments } from '../../fixtures/document/generate-documents';
import { Privacy } from '@cherryjuice/graphql-types';
import { users } from '../../fixtures/auth/login-credentials';
import { fixScrolling } from '../../support/helpers/cypress-helpers';
import { puppeteer } from '../../support/test-utils/puppeteer/puppeteer';
import { tn } from '../../support/helpers/tests-names';
import { assert } from '../../support/test-utils/assert/assert';

const bootstrap = () => {
  const treeConfig = {
    includeText: false,
    nodesPerLevel: [[2]],
    randomStyle: false,
  };
  const docAsts = generateDocuments({
    numberOfDocuments: 1,
    treeConfig,
  });
  const docsPrivacy = [
    {
      privacy: Privacy.GUESTS_ONLY,
      guests: [{ user: users.user1, writeAccess: true }],
    },
  ];

  const additionalNode = {
    text: 'this node is created by ' + users.user1.username,
    children: [],
    name: 'created by user',
    levelIndex: 0,
    id: 99,
    images: [],
    isBold: true,
    icon: 3,
  };
  const newNodeAttributes = {
    text: `this text is added by user ${users.user1.username}`,
    name: 'new name',
    icon: 48,
    color: '#ff0fff',
    isBold: true,
  };
  return {
    docAsts,
    docsPrivacy,
    documentMutation: { additionalNode, newNodeAttributes },
  };
};

describe('write guest', function() {
  const { docAsts, docsPrivacy, documentMutation } = bootstrap();
  // delete all documents of the user
  before(() => {
    fixScrolling();
    cy.log('delete all documents of the user');
    puppeteer.auth.signIn(users.user0);
    puppeteer.manage.deleteDocuments([], true);
  });

  // create 1 document
  docAsts.forEach(docAst => {
    it(tn.p.createDocument(docAst), () => {
      puppeteer.manage.createDocument(docAst);
    });
  });

  // save the document
  it(tn.p.saveDocuments(), () => {
    puppeteer.manage.saveDocument(docAsts);
  });

  // set doc0 to g-only > add user1 as W guest
  docsPrivacy.forEach((privacySetting, i) => {
    it(tn.p.setDocumentPrivacy(docAsts[i], privacySetting.privacy), () => {
      const docAst = docAsts[i];
      puppeteer.auth.signIn(users.user0);
      puppeteer.manage.selectDocument(docAst);
      puppeteer.manage.setDocumentPrivacy(docAst, privacySetting);
      puppeteer.manage.saveDocument(docAsts);
    });
  });

  // mutate node text and node meta by the guest
  it(tn.p.mutateDocumentText(docAsts[0], users.user1), () => {
    const { additionalNode, newNodeAttributes } = documentMutation;
    const user = users.user1;
    const docAst = docAsts[0];
    puppeteer.auth.signIn(user);
    puppeteer.manage.selectDocument(docAst);

    puppeteer.content.nodeMeta.edit({
      editedNode: docAst.tree[0][0],
      newAttributes: newNodeAttributes,
    });
    puppeteer.content.nodeMeta.delete({
      tree: docAst.tree,
      nodeCoordinates: [0, 1],
    });
    docAst.tree[0].push(additionalNode);
    puppeteer.content.nodeMeta.create({
      node: additionalNode,
    });
    puppeteer.content.setDocumentText(docAst, true);
    puppeteer.manage.saveDocument(docAsts);
  });

  // assert mutated content
  docsPrivacy[0].guests.forEach(guest => {
    const docAst = docAsts[0];
    it(tn.docIsAvaiToGuest(docAst, guest), () => {
      assert.documentIsAvailableToGuest(docAst, guest);
    });

    it(tn.docsAreAvaiToGuest(1, guest), () => {
      assert.guestHasTheRightDocuments(1, guest.user);
    });
  });

  // assert guest can NOT rename document
  it(tn.a.guestCantDeleteDocument(docAsts[0], users.user1), () => {
    const user = users.user1;
    const docAst = docAsts[0];
    puppeteer.auth.signIn(user);
    puppeteer.manage.deleteDocuments([docAst], false, {
      closeDocumentsList: false,
    });
    cy.contains('Could not perform the deletion');
  });
});
