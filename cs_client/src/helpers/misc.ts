
const getSelectedNodeFromRoute = ({ pathname }) =>
  /(\d+)$/.test(pathname) ? +/(\d+)$/.exec(pathname)[1] : 0;



const getTreeStateFromLocalStorage = () => {
  const savedState = localStorage.getItem('treeState');
  if (savedState) return JSON.parse(savedState);
  else return {};
};

const expandParents = ({ tree, id, nodes }) => {
  const node = nodes.get(id);
  if (node) {
    const { father_id } = node;
    console.log({ tree });
    if (father_id > -1) {
      tree[father_id] = true;
      expandParents({ tree, id: father_id, nodes });
    }
  }
};

export {
  getSelectedNodeFromRoute,
  getTreeStateFromLocalStorage,
  expandParents
};
