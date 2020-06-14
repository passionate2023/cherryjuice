import { concat } from 'rxjs';
import { AlertType } from '::types/react';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ac } from '::root/store/store';
import { Actions } from '::root/store/actions.types';

type ErrorDetails = {
  title: string;
  description: string;
};
type CreateErrorHandler = {
  errorDetails: ErrorDetails;
  actionCreators: (() => Actions)[];
};
const createErrorHandler = ({
  errorDetails: { title, description },
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
      ...actionCreators.map(action => of(action())),
    );
  });

export { createErrorHandler };
