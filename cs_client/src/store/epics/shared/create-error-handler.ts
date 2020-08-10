import { concat } from 'rxjs';
import { AlertType } from '::types/react';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ac } from '::store/store';
import { CreateAlertHandler } from './create-timeout-handler';

type CreateErrorHandler = CreateAlertHandler & { dontShowAlert?: boolean };

const createErrorHandler = ({
  alertDetails: { title, description, action, descriptionFactory },
  actionCreators = [],
  dontShowAlert,
}: CreateErrorHandler) =>
  catchError(error => {
    return concat(
      ...[
        !dontShowAlert &&
          of(
            ac.__.dialogs.setAlert({
              title,
              description: descriptionFactory
                ? descriptionFactory(error)
                : description,
              type: AlertType.Error,
              error,
              ...(action && { action }),
            }),
          ),
      ].filter(Boolean),
      ...actionCreators.map(actionCreator => of(actionCreator(error))),
    );
  });

export { createErrorHandler };
