import { concat } from 'rxjs';
import { AlertType } from '::types/react';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ac } from '::root/store/store';
import { CreateAlertHandler } from './create-timeout-handler';

type CreateErrorHandler = CreateAlertHandler;

const createErrorHandler = ({
  alertDetails: { title, description },
  actionCreators,
}: CreateErrorHandler) =>
  catchError(error => {
    return concat(
      of(
        ac.__.dialogs.setAlert({
          title,
          description,
          type: AlertType.Error,
          error,
        }),
      ),
      ...actionCreators.map(actionCreator => of(actionCreator(error))),
    );
  });

export { createErrorHandler };
