import * as React from 'react';
import { updatedCachedMeta } from '::app/editor/document/tree/node/helpers/apollo-cache';
import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { appActionCreators } from '::app/reducer';
import { NodeCached } from '::types/graphql/adapters';
import { useHistory } from 'react-router-dom';

const calculateDiff = ({
  newNode,
  meta,
  refs: {
    nameInput,
    isBoldInput,
    customColorValueInput,
    customIconValue,
    isReadOnlyInput,
    hasCustomColorInput,
    hasCustomIconInput,
  },
}) => {
  const { name, node_title_styles, icon_id, read_only } = meta;
  const style = JSON.parse(node_title_styles);
  const newStyle = JSON.stringify({
    color: hasCustomColorInput.current.checked
      ? customColorValueInput.current.value
      : '#ffffff',
    fontWeight: isBoldInput.current.checked ? 'bold' : 'normal',
  });
  const newIconId = !hasCustomIconInput.current.checked
    ? '0'
    : customIconValue.current.value;
  const res: { [k: string]: any } = {};
  if (newNode) {
    res.name = nameInput.current.value || '?';
    res.node_title_styles = newStyle;
    res.icon_id = newIconId;
    res.read_only = isReadOnlyInput.current.checked ? 1 : 0;
    return {
      ...meta,
      ...res,
    };
  } else {
    if (nameInput.current.value !== name) res.name = nameInput.current.value;
    if (newStyle !== JSON.stringify(style)) res.node_title_styles = newStyle;
    if (newIconId !== icon_id) res.icon_id = newIconId;
    if (isReadOnlyInput.current.checked !== Boolean(read_only))
      res.read_only = isReadOnlyInput.current.checked ? 1 : 0;
    return res;
  }
};

const useSave = (cache, nodeId: string, meta: NodeCached, newNode: boolean) => {
  const history = useHistory();
  const [
    nameInput,
    isBoldInput,
    customColorValueInput,
    customIconValue,
    isReadOnlyInput,
    hasCustomColorInput,
    hasCustomIconInput,
  ] = Array.from({
    length: 7,
  }).map(() => React.createRef<HTMLInputElement>());

  const onSave = () => {
    const res = calculateDiff({
      newNode,
      meta,
      refs: {
        nameInput,
        isBoldInput,
        customColorValueInput,
        customIconValue,
        isReadOnlyInput,
        hasCustomColorInput,
        hasCustomIconInput,
      },
    });
    if (Object.keys(res)) updatedCachedMeta({  nodeId, meta: res });
    newNode
      ? documentActionCreators.createNewNode(nodeId)
      : documentActionCreators.setNodeMetaHasChanged(nodeId, Object.keys(res));

    const nodePath = `/document/${meta.documentId}/node/${meta.node_id}`;
    history.push(nodePath);
    appActionCreators.hideNodeMeta();
  };
  return {
    onSave,
    refs: {
      nameInput,
      isBoldInput,
      customColorValueInput,
      customIconValue,
      isReadOnlyInput,
      hasCustomColorInput,
      hasCustomIconInput,
    },
  };
};

export { useSave };
