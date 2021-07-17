import { FormInputProps } from '::shared-components/form/meta-form/meta-form-input';
import { nodeMetaActionCreators } from '::app/components/menus/dialogs/node-meta/reducer/reducer';
import { testIds } from '@cherryjuice/test-ids';
import { SelectPrivacy } from '::app/components/menus/dialogs/document-meta/components/select-privacy/select-privacy';
import { Privacy } from '@cherryjuice/graphql-types';
import { Chips } from '::app/components/menus/dialogs/document-meta/components/chips/chips';
import * as React from 'react';
import { useMemo } from 'react';
import { NodeStyle } from '::app/components/menus/dialogs/node-meta/components/node-style/node-style';
import { SquareToggle } from '::app/components/menus/dialogs/node-meta/components/square-toggle/square-toggle';

export const useFormInputs = ({
  documentPrivacy,
  state,
  mbOrTb,
  showDialog,
  isOwnerOfDocument,
}) => {
  return useMemo(() => {
    const inputs: FormInputProps[] = [
      isOwnerOfDocument && {
        customInput: (
          <SelectPrivacy
            disabled={documentPrivacy === Privacy.PRIVATE}
            privacy={state.privacy}
            onChange={nodeMetaActionCreators.setPrivacy}
            maximumPrivacy={documentPrivacy}
            useNodeOptions={true}
            testId={testIds.nodeMeta__privacy}
          />
        ),
        label: 'Visibility',
      },
      {
        label: 'Tags',
        monolithComponent: (
          <Chips
            label={'Tags'}
            chips={state.tags.map(tag => ({ text: tag }))}
            onRemove={nodeMetaActionCreators.removeTag}
            addChip={tag =>
              new Promise<{ clearInput: boolean }>(resolve => {
                if (tag) {
                  nodeMetaActionCreators.addTag(tag);
                  resolve({ clearInput: true });
                } else return { clearInput: false };
              })
            }
            placeholder={'tags'}
            pattern={'[^,\\s]*'}
          />
        ),
      },
      {
        label: 'Style',
        customInput: (
          <NodeStyle
            customColor={state.customColor}
            customIcon={state.customIcon}
            isBold={state.isBold}
            nodeDepth={state.nodeDepth}
          />
        ),
      },
      {
        label: 'Read only',
        customInput: (
          <SquareToggle
            onClick={nodeMetaActionCreators.toggleIsReadOnly}
            icon={'lock'}
            enabled={state.isReadOnly}
            iconSize={14}
          />
        ),
      },
    ].filter(Boolean);
    return inputs;
  }, [documentPrivacy, state, mbOrTb, showDialog, isOwnerOfDocument]);
};
