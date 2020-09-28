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
import { Select } from '::root/components/shared-components/inputs/select';
import {
  codeboxAC,
  codeboxR,
  codeboxRTC,
} from '::root/components/app/components/menus/dialogs/codebox/reducer/reducer';
import { NumberInput } from '::root/components/shared-components/inputs/number-input';
import {
  createCodeboxHtml,
  insertObject,
} from '::helpers/editing/anchor/insert-object';

const mapState = (state: Store) => ({
  showDialog: state.dialogs.showCodeboxDialog,
  selection: state.editor.selection,
  selectedCodebox: state.editor.selectedCodebox,
  isOnMd: state.root.isOnMd,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;
const CodeboxDialogWithTransition: React.FC<Props> = ({
  isOnMd,
  showDialog,
  selection,
  selectedCodebox,
}) => {
  const [state, dispatch] = useReducer(codeboxR, undefined, codeboxRTC);
  useEffect(() => {
    codeboxAC.init(dispatch);
  }, []);

  useEffect(() => {
    if (selectedCodebox) {
      codeboxAC.resetToEdit({
        autoExpandHeight: selectedCodebox.autoExpandHeight,
        height: selectedCodebox.height,
        width: selectedCodebox.width,
        widthType: selectedCodebox.widthType,
      });
    } else codeboxAC.resetToCreate();
  }, [showDialog, selectedCodebox]);
  const inputs: FormInputProps[] = [
    {
      label: 'width',
      customInput: (
        <NumberInput
          min={10}
          max={5000}
          value={'' + state.values.width}
          onChange={codeboxAC.setWidth}
          label={'width'}
        />
      ),
      additionalInput: (
        <Select
          options={['pixels', '%']}
          onChange={codeboxAC.setWidthType}
          value={state.values.widthType}
        />
      ),
    },
    {
      label: 'height',
      customInput: (
        <NumberInput
          min={10}
          max={5000}
          value={'' + state.values.height}
          onChange={codeboxAC.setHeight}
          label={'height'}
        />
      ),
      additionalInput: (
        <Select
          options={['fixed', 'auto']}
          onChange={codeboxAC.setAutoExpandHeight}
          value={state.values.autoExpandHeight}
        />
      ),
    },
  ];
  const create = () => {
    try {
      insertObject(selection, {
        type: 'code',
        outerHTML: createCodeboxHtml(state.values),
      });
    } catch (e) {
      ac.dialogs.setAlert({
        title: 'Could not create the codebox',
        description: 'please refresh the page',
        type: AlertType.Error,
        error: e,
      });
    }
  };
  const edit = () => {
    try {
      const target = selectedCodebox.target;
      const height = state.values.height + 'px';
      const width =
        state.values.width + (state.values.widthType === 'pixels' ? 'px' : '%');
      target.style.width = width;
      target.style.maxWidth = width;
      target.style.minHeight = height;
      target.style.height =
        state.values.autoExpandHeight === 'fixed' ? height : '';
      target.dataset.is_width_pix = state.values.widthType === 'pixels' ? 1 : 0;
      target.dataset.width__raw = state.values.width;
    } catch (e) {
      ac.dialogs.setAlert({
        title: 'Could not create the codebox',
        description: 'please refresh the page',
        type: AlertType.Error,
        error: e,
      });
    }
  };
  const apply = useDelayedCallback(
    ac.dialogs.hideCodeboxDialog,
    selectedCodebox ? edit : create,
  );

  const buttonsRight: TDialogFooterButton[] = [
    {
      label: 'dismiss',
      onClick: ac.dialogs.hideCodeboxDialog,
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
      dialogTitle={selectedCodebox ? 'Edit codebox' : 'Create codebox'}
      footRightButtons={buttonsRight}
      isOnMobile={isOnMd}
      show={Boolean(showDialog)}
      onClose={ac.dialogs.hideCodeboxDialog}
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

const _ = connector(CodeboxDialogWithTransition);

export default _;
