import { from, Observable } from 'rxjs';
// https://dev.to/frederikprijck/converting-a-promise-into-an-observable-dag
export const cancelablePromise$ = <T>(
  promiseFactory: (signal: AbortSignal) => Promise<T>,
): Observable<T> =>
  new Observable(observer => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const subscription = from(promiseFactory(signal)).subscribe(observer);
    return () => {
      abortController.abort();
      subscription.unsubscribe();
    };
  });
