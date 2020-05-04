const getTreeStateFromLocalStorage = () => {
  const savedState = localStorage.getItem('treeState');
  if (savedState) return JSON.parse(savedState);
  else return {};
};

const expandParents = ({ tree, id, nodes }) => {
  const node = nodes.get(id);
  if (node) {
    const { father_id } = node;
    if (father_id > -1) {
      tree[father_id] = true;
      expandParents({ tree, id: father_id, nodes });
    }
  }
};

export { getTreeStateFromLocalStorage, expandParents };
