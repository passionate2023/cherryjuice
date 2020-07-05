import { assertNodeText } from '../support/assertions/content/node-text';
import { dialogs } from '../support/workflows/dialogs/dialogs';
import { editor } from '../support/workflows/editor/editor';
import { generateDocument } from '../fixtures/document/generate-document';
import { documentPuppeteer } from '../support/workflows/document/document-puppeteer';

describe('create document > edit-document > delete-document', () => {
  const documentBaseName = `test-${Math.floor(Math.random() * 100000)}`;
  const treeConfig = {
    nodesPerLevel: [[1]],
    includeText: true,
    randomStyle: false,
  };
  const documents = [
    {
      documentConfig: {
        name: `${documentBaseName}-doc-1`,
      },
      treeConfig,
    },
    {
      documentConfig: {
        name: `${documentBaseName}-doc-2`,
      },
      treeConfig,
    },
  ].map(generateDocument);
  const additionalDocuments = [
    {
      documentConfig: {
        name: `${documentBaseName}-doc-3`,
      },
      treeConfig,
    },
  ].map(generateDocument);

  const state = {
    numberOfDocuments: 0,
  };
  before(() => {
    documentPuppeteer.goToHomeScreen();
  });

  it('perform: remember number of documents', () => {
    documentPuppeteer.inspect.getNumberOfDocuments().then(n => {
      state.numberOfDocuments = n;
    });
  });
  documents.forEach(docAst => {
    it(`perform: create document[${docAst.meta.name}]`, () => {
      dialogs.documentMeta.create(docAst.meta);
    });
    it(`perform: create nodes[${docAst.meta.name}]`, () => {
      documentPuppeteer.createTree(docAst);
    });
    it(`perform: write text[${docAst.meta.name}]`, () => {
      editor.keyboard.typeText(docAst.tree[0]);
    });
  });

  it('perform: save document', () => {
    documentPuppeteer.saveDocument(documents);
  });

  it('perform: get hash of each created document', () => {
    documentPuppeteer.inspect.getDocumentsHash(documents);
  });

  it('assert: each document has unique hash', () => {
    expect(documents[0].meta.hash).to.not.be.empty;
    expect(documents[1].meta.hash).to.not.be.empty;
    expect(documents[0].meta.hash).to.not.equal(documents[1].meta.hash);
  });

  documents.forEach(document => {
    it(`assert: content of document[${document.meta.name}]`, () => {
      documentPuppeteer.goToDocument(document);
      document.tree[0].forEach(node => {
        assertNodeText({ node, text: node.text });
      });
    });
  });

  it('perform: rename document', () => {
    documentPuppeteer.renameDocument(documents[0], documents[1].meta.name);
  });

  it('perform: save document', () => {
    documentPuppeteer.saveDocument(documents);
  });
  it('perform: get documents hash', () => {
    documentPuppeteer.inspect.getDocumentsHash(documents);
  });
  it('assert: documents have same hash', () => {
    expect(documents[0].meta.hash).to.equal(documents[1].meta.hash);
  });

  additionalDocuments.forEach(docAst => {
    it(`perform: create document[${docAst.meta.name}]`, () => {
      dialogs.documentMeta.create(docAst.meta);
    });
    it(`perform: create nodes[${docAst.meta.name}]`, () => {
      documentPuppeteer.createTree(docAst);
    });
    it(`perform: write text[${docAst.meta.name}]`, () => {
      editor.keyboard.typeText(docAst.tree[0]);
    });
  });

  it('perform: get documents hash', () => {
    documentPuppeteer.inspect.getDocumentsHash(additionalDocuments);
  });
  it('perform: delete saved and unsaved documents', () => {
    documentPuppeteer.deleteDocuments([documents[0], additionalDocuments[0]]);
  });
  it('assert: delete saved and unsaved documents', () => {
    cy.get('.selectFile__file__name ').then(documents => {
      expect(documents.length).to.be.equal(state.numberOfDocuments + 1);
    });
    dialogs.documentsList.close();
  });
  it('perform: export document', () => {
    documentPuppeteer.exportDocument(documents[1]);
  });

  it('perform: import and open exported document', () => {
    const document = documents[1];
    documentPuppeteer.importLocalFile({
      suffix: 'exported',
      extension: 'ctb',
      name: `${document.meta.name}`,
      tempSubFolder: new Date().getTime().toString(),
    });
  });
  it('assert: imported document content', () => {
    const document = documents[1];
    document.tree[0].forEach(node => {
      assertNodeText({ node, text: node.text });
    });
  });
});
