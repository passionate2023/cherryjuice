import * as React from 'react';
import { useEffect, useMemo, useReducer } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { MetaForm } from '::root/components/shared-components/form/meta-form/meta-form';
import {
  nodeMetaActionCreators,
  nodeMetaInitialState,
  nodeMetaReducer,
} from '::root/components/app/components/menus/dialogs/node-meta/reducer/reducer';
import { IconPicker } from '::root/components/app/components/menus/dialogs/node-meta/components/icon-picker';
import { FormInputProps } from '::root/components/shared-components/form/meta-form/meta-form-input';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { SelectPrivacy } from '::root/components/app/components/menus/dialogs/document-meta/components/select-privacy/select-privacy';
import { Privacy } from '@cherryjuice/graphql-types';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { ColorInput } from '::root/components/shared-components/inputs/color-input';
import { ToggleSwitch } from '::root/components/shared-components/inputs/toggle-switch';
import { getNode as getNodeSelector } from '::store/selectors/cache/document/node';
import { editNode } from '::root/components/app/components/menus/dialogs/node-meta/hooks/save/helpers/edit-node';
import { createNode } from '::root/components/app/components/menus/dialogs/node-meta/hooks/save/helpers/create-node';
import { useDelayedCallback } from '::hooks/react/delayed-callback';

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

  const editedNode = useMemo(() => {
    const newNode =
      showDialog === 'create-sibling' || showDialog === 'create-child';
    const documentId = document?.id;
    return newNode
      ? undefined
      : getNodeSelector({ node_id, documentId: documentId });
  }, [node_id, document?.id, showDialog]);
  const fatherNode = nodes ? nodes[node_id] : undefined;

  useEffect(() => {
    if (editedNode) nodeMetaActionCreators.resetToEdit({ node: editedNode });
    else {
      nodeMetaActionCreators.resetToCreate({
        fatherNode,
      });
    }
  }, [node_id, showDialog, fatherNode]);
  const apply = useDelayedCallback(
    onClose,
    editedNode
      ? () => editNode({ nodeA: editedNode, nodeBMeta: state })
      : () =>
          createNode({
            document,
            nodeBMeta: state,
            createSibling: showDialog === 'create-sibling',
          }),
  );
  const buttonsRight = [
    {
      label: 'dismiss',
      onClick: onClose,
      disabled: false,
    },
    {
      label: 'apply',
      onClick: apply,
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
      lazyAutoFocus: !isOnMd && Boolean(showDialog),
      testId: testIds.nodeMeta__nodeName,
    } as FormInputProps,
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
      label: 'bold',
      customInput: (
        <ToggleSwitch
          value={state.isBold}
          onChange={nodeMetaActionCreators.setIsBold}
        />
      ),
      testId: testIds.nodeMeta__isBold,
    },
    {
      customInput: (
        <ToggleSwitch
          value={state.hasCustomColor}
          onChange={nodeMetaActionCreators.setHasCustomColor}
        />
      ),
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
      label: 'icon',
      customInput: (
        <ToggleSwitch
          value={state.hasCustomIcon}
          onChange={nodeMetaActionCreators.setHasCustomIcon}
        />
      ),
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
      label: 'read only',
      customInput: (
        <ToggleSwitch
          value={state.isReadOnly}
          onChange={nodeMetaActionCreators.setIsReadOnly}
        />
      ),
    },
  ].filter(Boolean);

  return (
    <DialogWithTransition
      dialogTitle={'Node Properties'}
      footerLeftButtons={[]}
      footRightButtons={buttonsRight}
      isOnMobile={isOnMd}
      show={Boolean(showDialog)}
      onClose={onClose}
      onConfirm={apply}
      rightHeaderButtons={[]}
      small={true}
      isShownOnTopOfDialog={true}
    >
      <ErrorBoundary>
        <MetaForm inputs={inputs} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default connector(NodeMetaModalWithTransition);
