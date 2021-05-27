import { DocumentAst, generateDocument } from './generate-document';
import { GenerateTreeProps } from '../tree/generate-tree';
import { Privacy } from '@cherryjuice/graphql-types';

type GenerateDocumentsProps = {
  numberOfDocuments: number;
  treeConfig: GenerateTreeProps;
  privacy?: Privacy;
};

export const generateDocuments = ({
  treeConfig,
  numberOfDocuments,
  privacy,
}: GenerateDocumentsProps): DocumentAst[] => {
  const documentBaseName = `test-${Math.floor(Math.random() * 1000)}`;
  return Array.from({ length: numberOfDocuments })
    .map((_, i) => ({
      documentConfig: {
        name: `${documentBaseName}-doc-${i + 1}`,
        privacy,
      },
      treeConfig,
    }))
    .map(generateDocument);
};
