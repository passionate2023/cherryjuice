import { FormInputProps } from '::shared-components/form/meta-form/meta-form-input';
import * as React from 'react';
import { useMemo } from 'react';
import { documentMetaActionCreators } from '::app/components/menus/dialogs/document-meta/reducer/reducer';
import { testIds } from '::cypress/support/helpers/test-ids';
import { SelectPrivacy } from '::app/components/menus/dialogs/document-meta/components/select-privacy/select-privacy';
import { Privacy } from '@cherryjuice/graphql-types';
import { Guests } from '::app/components/menus/dialogs/document-meta/components/guests/guests';

export const useFormInputs = ({
  isOnMd,
  isOwnerOfFocusedDocument,
  userId,
  state,
  showDialog,
}) => {
  return useMemo(() => {
    const inputs: FormInputProps[] = [
      {
        onChange: documentMetaActionCreators.setName,
        value: state.name,
        type: 'text',
        label: 'name',
        lazyAutoFocus: !isOnMd && Boolean(showDialog),
        testId: testIds.documentMeta__documentName,
      },
    ];
    if (isOwnerOfFocusedDocument || showDialog === 'create') {
      inputs.push({
        customInput: (
          <SelectPrivacy
            testId={testIds.documentMeta__documentPrivacy}
            privacy={state.privacy}
            onChange={documentMetaActionCreators.setPrivacy}
          />
        ),
        label: 'visibility',
      });
      if (state.privacy !== Privacy.PRIVATE) {
        inputs.push({
          monolithComponent: <Guests guests={state.guests} userId={userId} />,
          label: 'guests',
        });
      }
    }
    return inputs;
  }, [isOnMd, isOwnerOfFocusedDocument, userId, state, showDialog]);
};
