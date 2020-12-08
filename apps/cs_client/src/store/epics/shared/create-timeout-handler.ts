import { concat, of } from 'rxjs';
import { AlertAction, AlertType } from '::types/react';
import { timeoutWith } from 'rxjs/operators';
import { ac_ } from '::store/store';
import { Actions } from '../../actions.types';
import { virtualTimeScheduler } from '::store/epics/shared/test-helpers';

type AlertDetails = {
  title: string;
  description?: string;
  descriptionFactory?: (Error) => string;
  action?: AlertAction;
  dismissAction?: AlertAction;
};
type CreateAlertHandler = {
  alertDetails: AlertDetails;
  actionCreators?: ((error?: any) => Actions)[];
  mode?: 'snackbar' | 'modal';
};

type CreateTimeoutHandler = CreateAlertHandler & { due: number };
const createTimeoutHandler = ({
  alertDetails: { title, description },
  actionCreators = [],
  due,
  mode = 'modal',
}: CreateTimeoutHandler) =>
  timeoutWith(
    due,
    concat(
      of(
        mode === 'modal'
          ? ac_.dialogs.setAlert({
              title,
              description,
              type: AlertType.Warning,
            })
          : ac_.dialogs.setSnackbar({
              message: title,
              type: AlertType.Warning,
            }),
      ),
      ...actionCreators.map(action => of(action())),
      ...[process.env.NODE_ENV === 'test' && virtualTimeScheduler].filter(
        Boolean,
      ),
    ),
  );

export { createTimeoutHandler };
export { CreateAlertHandler };
