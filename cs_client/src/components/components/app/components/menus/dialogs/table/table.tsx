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
import { NumberInput } from '::root/components/shared-components/inputs/number-input';
import {
  createTableHtml,
  insertObject,
} from '::helpers/editing/anchor/insert-object';
import {
  tableAC,
  tableR,
  tableRTC,
} from '::root/components/app/components/menus/dialogs/table/reducer/reducer';

const mapState = (state: Store) => ({
  showDialog: state.dialogs.showTableDialog,
  selection: state.editor.selection,
  selectedTable: state.editor.selectedTable,
  isOnMd: state.root.isOnMd,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;
const TableDialogWithTransition: React.FC<Props> = ({
  isOnMd,
  showDialog,
  selection,
  selectedTable,
}) => {
  const [state, dispatch] = useReducer(tableR, undefined, tableRTC);
  useEffect(() => {
    tableAC.init(dispatch);
  }, []);

  useEffect(() => {
    if (selectedTable) {
      tableAC.resetToEdit({
        rows: selectedTable.rows,
        columns: selectedTable.columns,
      });
    } else tableAC.resetToCreate();
  }, [showDialog, selectedTable]);
  const inputs: FormInputProps[] = [
    {
      label: 'rows',
      customInput: (
        <NumberInput
          min={1}
          max={1000}
          value={'' + state.values.rows}
          onChange={tableAC.setRows}
          label={'rows'}
        />
      ),
    },
    {
      label: 'columns',
      customInput: (
        <NumberInput
          min={1}
          max={1000}
          value={'' + state.values.columns}
          onChange={tableAC.setColumns}
          label={'columns'}
        />
      ),
    },
  ];
  const create = () => {
    try {
      insertObject(selection, {
        type: 'table',
        outerHTML: createTableHtml(state.values),
      });
    } catch (e) {
      ac.dialogs.setAlert({
        title: 'Could not create the table',
        description: 'please refresh the page',
        type: AlertType.Error,
        error: e,
      });
    }
  };
  const edit = () => undefined;
  const apply = useDelayedCallback(
    ac.dialogs.hideTableDialog,
    selectedTable ? edit : create,
  );

  const buttonsRight: TDialogFooterButton[] = [
    {
      label: 'dismiss',
      onClick: ac.dialogs.hideTableDialog,
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
      dialogTitle={selectedTable ? 'Edit table' : 'Create table'}
      footRightButtons={buttonsRight}
      isOnMobile={isOnMd}
      show={Boolean(showDialog)}
      onClose={ac.dialogs.hideTableDialog}
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

const _ = connector(TableDialogWithTransition);

export default _;
