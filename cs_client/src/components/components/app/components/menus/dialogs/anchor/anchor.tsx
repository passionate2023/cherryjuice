import * as React from 'react';
import { useState } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { MetaForm } from '::root/components/shared-components/form/meta-form/meta-form';
import { FormInputProps } from '::root/components/shared-components/form/meta-form/meta-form-input';
import { AlertType } from '::types/react';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';

import { insertAnchor } from '::helpers/editing/anchor/insert-anchor';

const mapState = (state: Store) => ({
  showDialog: state.dialogs.showAnchorDialog,
  anchorId: state.editor.anchorId,
  selection: state.dialogs.selection,
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
  const [anchorId, setAnchorId] = useState(existingAnchorId);
  const inputs: FormInputProps[] = [
    {
      onChange: setAnchorId,
      value: anchorId,
      type: 'text',
      label: 'id',
      lazyAutoFocus: !isOnMd && Boolean(showDialog),
    },
  ];

  const createAnchor = () => {
    try {
      insertAnchor(selection, anchorId);
    } catch (e) {
      ac.dialogs.setAlert({
        title: 'Could not create the anchor',
        description: 'please refresh the page',
        type: AlertType.Error,
        error: e,
      });
    }
  };
  const editAnchor = () => undefined;
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
      disabled: !anchorId,
    },
  ];
  return (
    <DialogWithTransition
      dialogTitle={'Create anchor'}
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
