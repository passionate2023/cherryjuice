import * as React from 'react';
import { useEffect, useReducer } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { MetaForm } from '::root/components/shared-components/form/meta-form/meta-form';
import { useSave } from '::root/components/app/components/menus/dialogs/node-meta/hooks/save';
import {
  nodeMetaActionCreators,
  nodeMetaInitialState,
  nodeMetaReducer,
} from '::root/components/app/components/menus/dialogs/node-meta/reducer/reducer';
import { getNode } from '::root/components/app/components/menus/dialogs/node-meta/helpers/get-node';
import { IconPicker } from '::root/components/app/components/menus/dialogs/node-meta/components/icon-picker';
import { FormInputProps } from '::root/components/shared-components/form/meta-form/meta-form-input';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { SelectPrivacy } from '::root/components/app/components/menus/dialogs/document-meta/components/select-privacy/select-privacy';
import { Privacy } from '::types/graphql/generated';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { ColorInput } from '::root/components/shared-components/inputs/color-input';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    document,
    documentId: state.document.documentId,
    node_id: document?.persistedState?.selectedNode_id,
    nodes: document?.nodes,
    documentUserId: document?.userId,
    documentPrivacy: document?.privacy,
    showDialog: state.dialogs.showNodeMetaDialog,
    isOnMd: state.root.isOnMd,
    userId: state.auth.user?.id,
  };
};
const mapDispatch = {
  onClose: ac.dialogs.hideNodeMeta,
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type TNodeMetaModalProps = {};

const NodeMetaModalWithTransition: React.FC<TNodeMetaModalProps &
  PropsFromRedux> = ({
  showDialog,
  isOnMd,
  onClose,
  document,
  nodes,
  node_id,
  userId,
  documentUserId,
  documentPrivacy,
}) => {
  const isOwnerOfDocument = documentUserId === userId;
  const [state, dispatch] = useReducer(nodeMetaReducer, nodeMetaInitialState);
  useEffect(() => {
    nodeMetaActionCreators.init(dispatch);
  }, []);
  const { node, isNewNode, previous_sibling_node_id } = getNode({
    showDialog,
    document,
    node_id,
  });

  const fatherNode = nodes ? nodes[node_id] : undefined;
  useEffect(() => {
    if (showDialog === 'edit') nodeMetaActionCreators.resetToEdit({ node });
    else {
      nodeMetaActionCreators.resetToCreate({
        fatherNode,
      });
    }
  }, [node_id, showDialog, fatherNode]);
  const onSave = useSave({
    node,
    newNode: isNewNode,
    state,
    previous_sibling_node_id,
  });
  const buttonsRight = [
    {
      label: 'dismiss',
      onClick: onClose,
      disabled: false,
    },
    {
      label: 'apply',
      onClick: onSave,
      disabled: false,
      testId: testIds.nodeMeta__apply,
    },
  ];

  const inputs: FormInputProps[] = [
    {
      onChange: nodeMetaActionCreators.setName,
      value: state.name,
      type: 'text',
      label: 'name',
      lazyAutoFocus: !isOnMd,
      testId: testIds.nodeMeta__nodeName,
    },
    isOwnerOfDocument && {
      customInput: (
        <SelectPrivacy
          disabled={documentPrivacy === Privacy.PRIVATE}
          privacy={state.privacy}
          onChange={nodeMetaActionCreators.setPrivacy}
          maximumPrivacy={documentPrivacy}
          useNodeOptions={true}
          testId={testIds.nodeMeta__privacy}
        />
      ),
      label: 'visibility',
    },
    {
      onChange: nodeMetaActionCreators.setIsBold,
      value: state.isBold,
      type: 'checkbox',
      label: 'bold',
      testId: testIds.nodeMeta__isBold,
    },
    {
      onChange: nodeMetaActionCreators.setHasCustomColor,
      value: state.hasCustomColor,
      type: 'checkbox',
      label: 'color',
      testId: testIds.nodeMeta__hasCustomColor,
      additionalInput: (
        <ColorInput
          disabled={!state.hasCustomColor}
          onChange={nodeMetaActionCreators.setCustomColor}
          value={state.customColor}
          testId={testIds.nodeMeta__customColor}
        />
      ),
    },
    {
      onChange: nodeMetaActionCreators.setHasCustomIcon,
      value: state.hasCustomIcon,
      type: 'checkbox',
      label: 'icon',
      testId: testIds.nodeMeta__hasCustomIcon,
      additionalInput: (
        <IconPicker
          onChange={nodeMetaActionCreators.setCustomIcon}
          value={state.customIcon}
          disabled={!state.hasCustomIcon}
        />
      ),
    },
    {
      onChange: nodeMetaActionCreators.setIsReadOnly,
      value: state.isReadOnly,
      type: 'checkbox',
      label: 'read only',
    },
  ].filter(Boolean);

  return (
    <DialogWithTransition
      dialogTitle={'Node Properties'}
      dialogFooterLeftButtons={[]}
      dialogFooterRightButtons={buttonsRight}
      isOnMobile={isOnMd}
      show={Boolean(showDialog)}
      onClose={onClose}
      onConfirm={onSave}
      rightHeaderButtons={[]}
      small={true}
      docked={false}
      isShownOnTopOfDialog={true}
    >
      <ErrorBoundary>
        <MetaForm inputs={inputs} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default connector(NodeMetaModalWithTransition);
