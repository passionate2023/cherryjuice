import * as React from 'react';
import modDialog from '::sass-modules/shared-components/dialog.scss';
import { ReactNode } from 'react';
import { useSetCssVariables } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/search-filters';
import { ac } from '::root/store/store';

type Props = { dialogBodyElements: ReactNode };

const DialogBody: React.FC<Props> = ({ dialogBodyElements }) => {
  const ref = useSetCssVariables(ac.cssVariables.setDialogBodyHeight);
  return (
    <div className={`${modDialog.dialog__content}`} ref={ref}>
      {dialogBodyElements}
    </div>
  );
};

export { DialogBody };
