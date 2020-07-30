import { dialogs } from '../../../dialogs/dialogs';
import { testIds } from '../../../../helpers/test-ids';
import { wait } from '../../../../helpers/cypress-helpers';

const resolveTempFixturePath = ({
  name,
  tempSubFolder,
  extension,
  suffix,
}: ImportLocalFile) => {
  const folder = `temp/ctb/${tempSubFolder}/`;
  const path = `${folder}/${name}-${suffix}.${extension}`;
  return { folder, path };
};

type ImportLocalFile = {
  name: string;
  tempSubFolder: string;
  extension: string;
  suffix: string;
};
const importLocalFile = ({
  name,
  tempSubFolder,
  extension,
  suffix,
}: ImportLocalFile) => {
  cy.task('copyDownloadedFile', {
    name,
    tempSubFolder,
    extension,
    suffix,
  });
  const { path } = resolveTempFixturePath({
    name,
    tempSubFolder,
    extension,
    suffix,
  });
  dialogs.importDocument.show();
  cy.fixture(path, 'binary')
    .then(Cypress.Blob.binaryStringToBlob)
    .then(fileContent => {
      // @ts-ignore
      cy.findByTestId(testIds.dialogs__importDocument__fileInput).attachFile({
        fileContent,
        filePath: path,
        encoding: 'utf-8',
      });
    });
  cy.contains('finished');
  wait.s1;
  cy.findByTestId(testIds.dialogs__scrim).click({ force: true });
  cy.findByTestId(
    `${testIds.popups__documentOperations__openDownloadedDocument}`,
  ).click();
};

export { importLocalFile };
