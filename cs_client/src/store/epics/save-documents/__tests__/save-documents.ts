/* eslint-disable no-console */
import { ac_ } from '::store/store';
import { saveDocumentsEpic } from '::store/epics/save-documents/save-documents';
import { ActionsObservable } from 'redux-observable';
import { toArray } from 'rxjs/operators';
import { virtualTimeScheduler } from '::store/epics/shared/test-helpers';

jest.mock('../helpers/cache-current-node', () => {
  return {
    cacheCurrentNode: jest.fn(() => Promise.resolve()),
  };
});

jest.mock('../helpers/reset-cache', () => {
  return {
    resetCache: jest.fn(async () => undefined),
  };
});

jest.mock('../helpers/swap-persisted-tree-document-ids', () => {
  return {
    swapPersistedTreeDocumentIds: jest.fn(() => undefined),
  };
});

jest.mock('../helpers/save-document/save-documents', () => {
  return {
    saveDocuments: jest.fn(async () => undefined),
  };
});

describe.skip('save-documents epic', function() {
  it('test should run without errors', async () => {
    const state = {
      output: undefined,
    };
    state.output = await new Promise(res => {
      const save = ActionsObservable.of(ac_.document.save);
      const obs$ = saveDocumentsEpic(save, undefined, undefined).pipe(
        toArray(),
      );
      virtualTimeScheduler.flush();
      obs$.subscribe({
        next: output => {
          res(output);
          console.log(output);
        },
        error: console.error,
        complete: () => console.log('complete'),
      });
    });

    // @ts-ignore
    expect(state.output).toEqual([
      { type: 'savePending' },
      { type: 'node-cached' },
      { type: 'saveInProgress' },
      { type: 'cache-reset' },
      { type: 'saveFulfilled' },
    ]);
  });
});
