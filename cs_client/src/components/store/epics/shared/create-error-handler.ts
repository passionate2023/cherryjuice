import { appActionCreators } from '::app/reducer';
import { AlertType } from '::types/react';
import { catchError } from 'rxjs/operators';

const createErrorHandler = (title: string, description: string) =>
  catchError(error => {
    appActionCreators.setAlert({
      title,
      description,
      type: AlertType.Error,
      error,
    });
    return error;
  });

export { createErrorHandler };
