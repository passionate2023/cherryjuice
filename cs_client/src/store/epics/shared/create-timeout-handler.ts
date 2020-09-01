import { concat } from 'rxjs';
import { AlertAction, AlertType } from '::types/react';
import { timeoutWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { ac_ } from '::store/store';
import { Actions } from '../../actions.types';
import { virtualTimeScheduler } from '::store/epics/shared/test-helpers';

type AlertDetails = {
  title: string;
  description?: string;
  descriptionFactory?: (Error) => string;
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
        ac_.dialogs.setAlert({
          title,
          description,
          type: AlertType.Warning,
        }),
      ),
      ...actionCreators.map(action => of(action())),
      process.env.NODE_ENV === 'test' && virtualTimeScheduler,
    ),
  );

export { createTimeoutHandler };
export { CreateAlertHandler };
