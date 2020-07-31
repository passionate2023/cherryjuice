import { dialogs } from '../../../dialogs/dialogs';
import { testIds } from '../../../../helpers/test-ids';
import { wait } from '../../../../helpers/cypress-helpers';

const resolveTempFixturePath = ({
  name,
  tempSubFolder,
  extension,
  suffix,
}: ImportLocalFile & {
  tempSubFolder: string;
}) => {
  const folder = `temp/ctb/${tempSubFolder}/`;
  const path = `${folder}/${name}-${suffix}.${extension}`;
  return { folder, path };
};

type ImportLocalFile = {
  name: string;
  extension: string;
  suffix: string;
};
const importLocalFile = ({ name, extension, suffix }: ImportLocalFile) => {
  const tempSubFolder = new Date().getTime().toString();
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
  wait.s1;
};

export { importLocalFile };
