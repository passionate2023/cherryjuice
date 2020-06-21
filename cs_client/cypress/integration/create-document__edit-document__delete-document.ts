import { login } from '../support/workflows/login';
import { fixScrolling, wait } from '../support/helpers/cypress-helpers';
import { goHome } from '../support/workflows/navigate-home';
import { testIds } from '../support/helpers/test-ids';
import { assertNodeText } from '../support/assertions/content/node-text';
import { generateTree } from '../fixtures/tree/generate-tree';
import { dialogs } from '../support/workflows/dialogs/dialogs';
import { editor } from '../support/workflows/editor/editor';

describe('create document > edit-document > delete-document', () => {
  before(() => {
    fixScrolling();
    cy.visit(`/`);
    login();
    goHome();
    dialogs.documentsList.interact.close();
  });
  const documentBaseName = `test-${new Date().getSeconds()}:${new Date().getSeconds()}`;
  const documents = [
    {
      meta: {
        name: `${documentBaseName}-document-1`,
        id: '',
        hash: '',
      },
      tree: generateTree({
        nodesPerLevel: [[1]],
        includeText: true,
        randomStyle: false,
      }),
    },
    {
      meta: {
        name: `${documentBaseName}-document-2`,
        id: '',
        hash: '',
      },
      tree: generateTree({
        nodesPerLevel: [[1]],
        includeText: true,
        randomStyle: false,
      }),
    },
  ];
  const additionalDocuments = [
    {
      meta: {
        name: `${documentBaseName}-document-3`,
        id: '',
        hash: '',
      },
      tree: generateTree({
        nodesPerLevel: [[1]],
        includeText: true,
        randomStyle: false,
      }),
    },
  ];
  const state = {
    numberOfDocuments: 0,
  };
  it('perform: remember number of documents', () => {
    dialogs.documentsList.interact.show();
    cy.get('.selectFile').then(body$ => {
      const body = body$[0];
      state.numberOfDocuments = body.querySelectorAll(
        '.selectFile__file__name',
      ).length;
    });
    dialogs.documentsList.interact.close();
  });
  documents.forEach(document1 => {
    it('perform: create document', () => {
      dialogs.document.interact.create(document1.meta);
      cy.location().then(location => {
        document1.meta.id = /document\/([^/])/.exec(location.pathname)[1];
      });
    });
    it('perform: create nodes', () => {
      for (const node of document1.tree.flatMap(x => x)) {
        dialogs.node.create({ node });
        wait.ms500();
      }
    });

    it('perform: write text', () => {
      document1.tree[0].forEach(node => {
        editor.keyboard.typeText({ node, text: node.text });
      });
    });
  });
  it('perform: save document', () => {
    cy.findByTestId(testIds.toolBar__main__saveDocument).click();
    cy.contains('Document saved', { timeout: 10000 });
  });

  it('perform: get documents hash', () => {
    dialogs.documentsList.interact.show();
    documents.forEach(document => {
      dialogs.documentsList.inspect
        .getDocumentInfo(document.meta.name)
        .then(({ id, hash }) => {
          document.meta.id = id;
          document.meta.hash = hash;
        });
    });
  });

  it('assert: each document has unique hash', () => {
    expect(documents[0].meta.hash).to.not.be.empty;
    expect(documents[1].meta.hash).to.not.be.empty;
    expect(documents[0].meta.hash).to.not.equal(documents[1].meta.hash);
  });

  it('assert: documents content', () => {
    cy.reload();
    login();
    documents.forEach(document => {
      cy.visit(`/document/${document.meta.id}`);
      document.tree[0].forEach(node => {
        assertNodeText({ node, text: node.text });
      });
    });
  });

  it('perform: rename document', () => {
    const document = documents[0];
    cy.reload();
    login();
    cy.visit(`/document/${document.meta.id}`);
    dialogs.document.interact.rename({
      currentName: document.meta.name,
      newName: documents[1].meta.name,
    });
    documents[0].meta.name = documents[1].meta.name;
  });

  it('perform: save document', () => {
    cy.findByTestId(testIds.toolBar__main__saveDocument).click();
    cy.contains('Document saved', { timeout: 10000 });
  });
  it('perform: get documents hash', () => {
    dialogs.documentsList.interact.show();
    documents.forEach(document => {
      dialogs.documentsList.inspect
        .getDocumentInfo(undefined, document.meta.id)
        .then(({ id, hash }) => {
          document.meta.id = id;
          document.meta.hash = hash;
        });
    });
    dialogs.documentsList.interact.close();
  });
  it('assert: documents have same hash', () => {
    expect(documents[0].meta.hash).to.equal(documents[1].meta.hash);
  });

  additionalDocuments.forEach(document1 => {
    it('perform: create additional documents', () => {
      dialogs.document.interact.create(document1.meta);
      cy.location().then(location => {
        document1.meta.id = /document\/([^/])/.exec(location.pathname)[1];
      });
    });
    it('perform: create nodes', () => {
      for (const node of document1.tree.flatMap(x => x)) {
        dialogs.node.create({ node });
        wait.ms500();
      }
    });

    it('perform: write text', () => {
      document1.tree[0].forEach(node => {
        editor.keyboard.typeText({ node, text: node.text });
      });
    });
  });
  it('perform: get documents hash', () => {
    dialogs.documentsList.interact.show();
    additionalDocuments.forEach(document => {
      dialogs.documentsList.inspect
        .getDocumentInfo('*' + document.meta.name)
        .then(({ id, hash }) => {
          document.meta.id = id;
          document.meta.hash = hash;
        });
    });
    dialogs.documentsList.interact.close();
  });
  it('perform: delete saved and unsaved documents', () => {
    dialogs.documentsList.interact.show();
    [documents[0], additionalDocuments[0]].forEach(document => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.findByText(document.meta.id)
        .first()
        .trigger('mousedown')
        .wait(2000)
        .trigger('mouseup');
    });
    cy.findByTestId(
      testIds.dialogs__selectDocument__header__buttons__delete,
    ).click();
    wait.s1();
    wait.s1();
    cy.get('.selectFile__file__name ').then(documents => {
      expect(documents.length).to.be.equal(state.numberOfDocuments + 1);
    });
  });
});
