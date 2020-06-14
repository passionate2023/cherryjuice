import { AlertType } from '::types/react';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ac } from '::root/store/store';

const createErrorHandler = (title: string, description: string, action) =>
  catchError(error => {
    ac.dialogs.setAlert({
      title,
      description,
      type: AlertType.Error,
      error,
    });
    return of(action());
  });

export { createErrorHandler };
