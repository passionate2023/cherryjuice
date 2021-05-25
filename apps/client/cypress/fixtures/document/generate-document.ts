import {
  generateTree,
  GenerateTreeProps,
  TreeAst,
} from '../tree/generate-tree';
import { GuestAst } from '../../support/test-utils/puppeteer/epics/document/set-document-privacy';
import { Privacy } from '@cherryjuice/graphql-types';

type GenerateDocumentProps = {
  treeConfig: GenerateTreeProps;
  documentConfig: {
    name: string;
    privacy?: Privacy;
  };
};

type DocumentAst = {
  meta: {
    name: string;
    id: string;
    hash: string;
    unsaved: boolean;
    guests: GuestAst[];
    privacy: Privacy;
  };
  tree: TreeAst;
};

const generateDocument = ({
  treeConfig,
  documentConfig: { name, privacy },
}: GenerateDocumentProps): DocumentAst => {
  return {
    meta: {
      name,
      id: '',
      hash: '',
      unsaved: true,
      guests: [],
      privacy: privacy || Privacy.PRIVATE,
    },
    tree: generateTree(treeConfig),
  };
};

export { generateDocument };
export { DocumentAst };
