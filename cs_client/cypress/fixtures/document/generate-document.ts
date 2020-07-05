import {
  generateTree,
  GenerateTreeProps,
  TreeAst,
} from '../tree/generate-tree';

type CreateDocumentProps = {
  treeConfig: GenerateTreeProps;
  documentConfig: {
    name: string;
  };
};

type DocumentAst = {
  meta: {
    name: string;
    id: string;
    hash: string;
    unsaved: boolean;
  };
  tree: TreeAst;
};

const generateDocument = ({
  treeConfig,
  documentConfig: { name },
}: CreateDocumentProps): DocumentAst => {
  return {
    meta: {
      name,
      id: '',
      hash: '',
      unsaved: true,
    },
    tree: generateTree(treeConfig),
  };
};

export { generateDocument };
export { DocumentAst };
