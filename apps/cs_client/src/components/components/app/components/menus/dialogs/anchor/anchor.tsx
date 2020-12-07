import * as React from 'react';
import { useEffect, useReducer } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { MetaForm } from '::root/components/shared-components/form/meta-form/meta-form';
import { FormInputProps } from '::root/components/shared-components/form/meta-form/meta-form-input';
import { AlertType } from '::types/react';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import {
  createAnchorHtml,
  insertObject,
} from '::root/components/editor/helpers/objects/insert-object';
import {
  anchorAC,
  anchorR,
  anchorRTC,
} from '::root/components/app/components/menus/dialogs/anchor/reducer/reducer';

const getExistingAnchorIds = (): string[] =>
  Array.from(document.querySelectorAll('.rich-text__anchor')).map(el =>
    el.getAttribute('id'),
  );

const mapState = (state: Store) => ({
  showDialog: state.dialogs.showAnchorDialog,
  anchorId: state.editor.anchorId,
  selection: state.editor.selection,
  isOnMd: state.root.isOnMd,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;
const AnchorDialogWithTransition: React.FC<Props> = ({
  showDialog,
  anchorId: existingAnchorId = '',
  isOnMd,
  selection,
}) => {
  const [state, dispatch] = useReducer(anchorR, undefined, anchorRTC);
  useEffect(() => {
    anchorAC.init(dispatch);
  }, []);

  useEffect(() => {
    if (existingAnchorId) {
      anchorAC.resetToEdit({
        anchorId: existingAnchorId,
        existingIDs: getExistingAnchorIds(),
      });
    } else anchorAC.resetToCreate({ existingIDs: getExistingAnchorIds() });
  }, [showDialog, existingAnchorId]);
  const inputs: FormInputProps[] = [
    {
      onChange: anchorAC.setAnchorId,
      value: state.anchorId,
      type: 'text',
      label: 'id',
      lazyAutoFocus: !isOnMd && Boolean(showDialog),
    },
  ];
  const createAnchor = () => {
    try {
      insertObject(selection, {
        type: 'png',
        outerHTML: createAnchorHtml(state.anchorId),
      });
    } catch (e) {
      ac.dialogs.setAlert({
        title: 'Could not create the anchor',
        description: 'please refresh the page',
        type: AlertType.Error,
        error: e,
      });
    }
  };
  const editAnchor = () => {
    try {
      const anchor: HTMLElement = document.getElementById(existingAnchorId);
      anchor.setAttribute('id', state.anchorId);
    } catch (e) {
      ac.dialogs.setAlert({
        title: 'Could not create the anchor',
        description: 'please refresh the page',
        type: AlertType.Error,
        error: e,
      });
    }
  };
  const apply = useDelayedCallback(
    ac.dialogs.hideAnchorDialog,
    existingAnchorId ? editAnchor : createAnchor,
  );

  const buttonsRight: TDialogFooterButton[] = [
    {
      label: 'dismiss',
      onClick: ac.dialogs.hideAnchorDialog,
      disabled: false,
    },
    {
      label: 'apply',
      onClick: apply,
      disabled: !state.valid,
    },
  ];
  return (
    <DialogWithTransition
      dialogTitle={existingAnchorId ? 'Edit Anchor' : 'Create anchor'}
      footRightButtons={buttonsRight}
      isOnMobile={isOnMd}
      show={Boolean(showDialog)}
      onClose={ac.dialogs.hideAnchorDialog}
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

const _ = connector(AnchorDialogWithTransition);

export default _;
