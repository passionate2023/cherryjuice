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

const createAlert = e => ({
  title: 'Could not create the table',
  description: 'please refresh the page',
  type: AlertType.Error,
  error: e,
});

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
      ac.dialogs.setAlert(createAlert(e));
    }
  };
  const edit = () => {
    try {
      const target = selectedTable.target as HTMLTableElement;
      const currentHead = target.tHead.firstElementChild;
      const currentBody = target.tBodies[0];
      const currentHeadCells = Array.from(currentHead.children);
      const currentRows = Array.from(currentBody.children);

      const missingColumns =
        state.values.columns - currentHead.childElementCount;
      if (missingColumns > 0) {
        Array.from({ length: missingColumns }).forEach(() => {
          currentHead.appendChild(document.createElement('th'));
        });
        currentRows.forEach(row => {
          row.appendChild(document.createElement('td'));
        });
      } else if (missingColumns < 0) {
        currentHeadCells.forEach((cell, i) => {
          if (i + 1 > state.values.columns) cell.remove();
        });
        currentRows.forEach(row => {
          Array.from(row.children).forEach((cell, i) => {
            if (i + 1 > state.values.columns) cell.remove();
          });
        });
      }

      const missingRows = state.values.rows - currentRows.length;
      if (missingRows > 0) {
        const row = document.createElement('tr');
        currentBody.appendChild(row);
        Array.from({ length: state.values.columns }).forEach(() => {
          row.appendChild(document.createElement('td'));
        });
      } else if (missingRows < 0) {
        currentRows.forEach((row, i) => {
          if (i + 1 > state.values.rows) row.remove();
        });
      }
    } catch (e) {
      ac.dialogs.setAlert(createAlert(e));
    }
  };
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
