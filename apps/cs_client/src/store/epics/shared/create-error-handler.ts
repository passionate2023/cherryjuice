import { concat, of } from 'rxjs';
import { AlertType } from '::types/react';
import { catchError } from 'rxjs/operators';
import { ac_ } from '::store/store';
import { CreateAlertHandler } from './create-timeout-handler';

type CreateErrorHandler = CreateAlertHandler & { dontShowAlert?: boolean };

const createErrorHandler = ({
  alertDetails: {
    title,
    description,
    action,
    descriptionFactory,
    dismissAction,
  },
  actionCreators = [],
  dontShowAlert,
  mode = 'modal',
}: CreateErrorHandler) =>
  catchError(error => {
    return concat(
      ...[
        !dontShowAlert &&
          of(
            mode === 'modal'
              ? ac_.dialogs.setAlert({
                  title,
                  description: descriptionFactory
                    ? descriptionFactory(error)
                    : description,
                  type: AlertType.Error,
                  error,
                  dismissAction,
                  action,
                })
              : ac_.dialogs.setSnackbar({
                  message: title,
                  type: AlertType.Error,
                }),
          ),
      ].filter(Boolean),
      ...actionCreators.map(actionCreator => of(actionCreator(error))),
    );
  });

export { createErrorHandler };
