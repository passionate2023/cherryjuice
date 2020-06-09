import * as React from 'react';
import { EventHandler, useContext, useEffect, useReducer } from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { MetaForm } from '::shared-components/form/meta-form/meta-form';
import { save } from '::app/menus/node-meta/hooks/save';
import { NodeMetaPopupRole } from '::app/reducer';
import { AppContext } from '::app/context';
import {
  nodeMetaActionCreators,
  nodeMetaInitialState,
  nodeMetaReducer,
} from '::app/menus/node-meta/reducer/reducer';
import { getNode } from '::app/menus/node-meta/helpers/get-node';
import { modNodeMeta } from '::sass-modules/index';
import { IconPicker } from '::app/menus/node-meta/components/icon-picker';
import { FormInputProps } from '::shared-components/form/meta-form/meta-form-input';
import { testIds } from '::cypress/support/helpers/test-ids';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type TNodeMetaModalProps = {
  nodeId: string;
};

const NodeMetaModalWithTransition: React.FC<TNodeMetaModalProps & {
  onClose: EventHandler<any>;
  showDialog: NodeMetaPopupRole;
  isOnMobile: boolean;
} & PropsFromRedux> = ({
  showDialog,
  isOnMobile,
  nodeId,
  onClose,
  documentId,
}) => {
  const [state, dispatch] = useReducer(nodeMetaReducer, nodeMetaInitialState);
  useEffect(() => {
    nodeMetaActionCreators.__setDispatch(dispatch);
  }, []);
  const { highest_node_id } = useContext(AppContext);
  const { node, isNewNode, previous_sibling_node_id } = getNode({
    documentId,
    showDialog,
    nodeId,
    highest_node_id,
  });

  useEffect(() => {
    if (showDialog === NodeMetaPopupRole.EDIT)
      nodeMetaActionCreators.reset(node);
    else nodeMetaActionCreators.reset(undefined);
  }, [nodeId, showDialog]);
  const onSave = save({
    nodeId,
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
      label: 'Node name',
      lazyAutoFocus: 400,
      testId: testIds.nodeMeta__nodeName,
    },
    {
      onChange: nodeMetaActionCreators.setIsBold,
      value: state.isBold,
      type: 'checkbox',
      label: 'Bold',
      testId: testIds.nodeMeta__isBold,
    },
    {
      onChange: nodeMetaActionCreators.setHasCustomColor,
      value: state.hasCustomColor,
      type: 'checkbox',
      label: 'User selected color',
      testId: testIds.nodeMeta__hasCustomColor,
      additionalInput: (
        <input
          disabled={!state.hasCustomColor}
          type={'color'}
          onChange={e => nodeMetaActionCreators.setCustomColor(e.target.value)}
          value={state.customColor}
          className={`${modNodeMeta.nodeMeta__input__colorInput} ${
            !state.hasCustomColor ? modNodeMeta.nodeMeta__inputDisabled : ''
          }`}
          data-testid={testIds.nodeMeta__customColor}
        />
      ),
    },
    {
      onChange: nodeMetaActionCreators.setHasCustomIcon,
      value: state.hasCustomIcon,
      type: 'checkbox',
      label: 'User selected icon',
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
      label: 'Read only',
    },
  ];

  return (
    <DialogWithTransition
      dialogTitle={'Node Properties'}
      dialogFooterLeftButtons={[]}
      dialogFooterRightButtons={buttonsRight}
      isOnMobile={isOnMobile}
      show={Boolean(showDialog)}
      onClose={onClose}
      onConfirm={onSave}
      rightHeaderButtons={[]}
      small={true}
    >
      <ErrorBoundary>
        <MetaForm inputs={inputs} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default connector(NodeMetaModalWithTransition);
