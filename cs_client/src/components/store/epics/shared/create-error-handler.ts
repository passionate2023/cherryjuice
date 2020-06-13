import { appActionCreators } from '::app/reducer';
import { AlertType } from '::types/react';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

const createErrorHandler = (
  title: string,
  description: string,
  action,
) =>
  catchError(error => {
    appActionCreators.setAlert({
      title,
      description,
      type: AlertType.Error,
      error,
    });
    return of(action());
  });

export { createErrorHandler };
