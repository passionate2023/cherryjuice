import { concat } from 'rxjs';
import { AlertAction, AlertType } from '::types/react';
import { timeoutWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { ac } from '::root/store/store';
import { Actions } from '::root/store/actions.types';

type AlertDetails = {
  title: string;
  description: string;
  action?: AlertAction;
};
type CreateAlertHandler = {
  alertDetails: AlertDetails;
  actionCreators?: ((error?: any) => Actions)[];
};

type CreateTimeoutHandler = CreateAlertHandler & { due: number };
const createTimeoutHandler = ({
  alertDetails: { title, description },
  actionCreators = [],
  due,
}: CreateTimeoutHandler) =>
  timeoutWith(
    due,
    concat(
      of(
        ac.__.dialogs.setAlert({
          title,
          description,
          type: AlertType.Warning,
        }),
      ),
      ...actionCreators.map(action => of(action())),
    ),
  );

export { createTimeoutHandler };
export { CreateAlertHandler };
