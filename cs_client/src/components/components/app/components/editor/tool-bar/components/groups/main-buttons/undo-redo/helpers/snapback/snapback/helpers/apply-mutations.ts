import { EnhancedMutationRecord } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback';

const removeNode = (node: Node): void => {
  node.parentNode.removeChild(node);
};

const insertSibling = (nextSibling: HTMLElement) => (node: Node) => {
  nextSibling.parentNode.insertBefore(node, nextSibling);
};

const insertChild = (target: HTMLElement) => (node: Node) => {
  target.appendChild(node);
};

export const applyMutations = (
  mutations: EnhancedMutationRecord[],
  undo = false,
) => {
  mutations.forEach(mutation => {
    const target = mutation.target as HTMLElement;
    if (mutation.type === 'characterData') {
      mutation.target.textContent = undo
        ? mutation.oldValue
        : mutation.newValue;
    } else if (mutation.type === 'attributes') {
      const value = (undo ? mutation.oldValue : mutation.newValue) as
        | string
        | boolean
        | number;
      if (value || value === false || value === 0) {
        target.setAttribute(mutation.attributeName, String(value));
      } else {
        target.removeAttribute(mutation.attributeName);
      }
    } else if (mutation.type === 'childList') {
      const addNodes: NodeList = undo
        ? mutation.removedNodes
        : mutation.addedNodes;
      const removeNodes: NodeList = undo
        ? mutation.addedNodes
        : mutation.removedNodes;
      const nextSibling = mutation.nextSibling as HTMLElement;

      Array.from(addNodes).forEach(
        nextSibling
          ? insertSibling(nextSibling)
          : insertChild(target as HTMLElement),
      );

      Array.from(removeNodes).forEach(removeNode);
    }
  });
};
