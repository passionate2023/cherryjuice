import { FormInputProps } from '::shared-components/form/meta-form/meta-form-input';
import { nodeMetaActionCreators } from '::app/components/menus/dialogs/node-meta/reducer/reducer';
import { testIds } from '::cypress/support/helpers/test-ids';
import { SelectPrivacy } from '::app/components/menus/dialogs/document-meta/components/select-privacy/select-privacy';
import { Privacy } from '@cherryjuice/graphql-types';
import { Chips } from '::app/components/menus/dialogs/document-meta/components/chips/chips';
import { ToggleSwitch } from '::shared-components/inputs/toggle-switch';
import { ColorInput } from '@cherryjuice/components';
import { IconPicker } from '::app/components/menus/dialogs/node-meta/components/icon-picker';
import * as React from 'react';
import { useMemo } from 'react';

export const useFormInputs = ({
  documentPrivacy,
  state,
  isOnMd,
  showDialog,
  isOwnerOfDocument,
}) => {
  return useMemo(() => {
    const inputs: FormInputProps[] = [
      {
        onChange: nodeMetaActionCreators.setName,
        value: state.name,
        type: 'text',
        label: 'name',
        lazyAutoFocus: !isOnMd && Boolean(showDialog),
        testId: testIds.nodeMeta__nodeName,
      } as FormInputProps,
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
        label: 'visibility',
      },
      {
        label: 'tags',
        monolithComponent: (
          <Chips
            label={'tags'}
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
        label: 'bold',
        customInput: (
          <ToggleSwitch
            value={state.isBold}
            onChange={nodeMetaActionCreators.setIsBold}
          />
        ),
        testId: testIds.nodeMeta__isBold,
      },
      {
        customInput: (
          <ToggleSwitch
            value={state.hasCustomColor}
            onChange={nodeMetaActionCreators.setHasCustomColor}
          />
        ),
        label: 'color',
        testId: testIds.nodeMeta__hasCustomColor,
        additionalInput: (
          <ColorInput
            disabled={!state.hasCustomColor}
            onChange={nodeMetaActionCreators.setCustomColor}
            value={state.customColor}
            testId={testIds.nodeMeta__customColor}
          />
        ),
      },
      {
        label: 'icon',
        customInput: (
          <ToggleSwitch
            value={state.hasCustomIcon}
            onChange={nodeMetaActionCreators.setHasCustomIcon}
          />
        ),
        testId: testIds.nodeMeta__hasCustomIcon,
        additionalInput: (
          <IconPicker
            onChange={nodeMetaActionCreators.setCustomIcon}
            value={state.customIcon}
            disabled={!state.hasCustomIcon}
          />
        ),
      },
      {
        label: 'read only',
        customInput: (
          <ToggleSwitch
            value={state.isReadOnly}
            onChange={nodeMetaActionCreators.setIsReadOnly}
          />
        ),
      },
    ].filter(Boolean);
    return inputs;
  }, [documentPrivacy, state, isOnMd, showDialog, isOwnerOfDocument]);
};
