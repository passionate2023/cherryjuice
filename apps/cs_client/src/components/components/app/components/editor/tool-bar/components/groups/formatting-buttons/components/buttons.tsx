import { Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { getHotkeys } from '::store/selectors/cache/settings/hotkeys';
import { connect, ConnectedProps } from 'react-redux';
import * as React from 'react';
import { memo, useMemo } from 'react';
import {
  execK,
  FormattingButtonCategory,
  formattingHotkeysProps,
} from '@cherryjuice/editor';
import { ToolbarColorInput } from '@cherryjuice/components';
import { FormattingButton } from '::app/components/editor/tool-bar/components/groups/formatting-buttons/components/components/formatting-button';
import { DropDownButton } from '@cherryjuice/components';
import mod from '::app/components/editor/tool-bar/components/groups/formatting-buttons/formatting-buttons.scss';
export const onDropdownToggle = shown => {
  const container = document.querySelector(
    '.' + mod.formattingButtonsContainer,
  ) as HTMLDivElement;
  if (container) container.style.zIndex = shown ? 2 : 0;
};
const mapState = (state: Store) => {
  return {
    selectedNode_id: getCurrentDocument(state)?.persistedState?.selectedNode_id,
    documentId: state.document.documentId,
    formattingHotKeys: getHotkeys(state).formatting,
    md: state.root.isOnTb,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Buttons: React.FC<PropsFromRedux> = ({
  selectedNode_id,
  documentId,
  formattingHotKeys,
  md,
}) => {
  const disabled = !documentId || !selectedNode_id;

  const categories = useMemo(
    () =>
      formattingHotKeys.reduce(
        (categories, hotKey) => {
          const props = formattingHotkeysProps[hotKey.type];
          if (props?.category) categories[props.category].push([hotKey, props]);
          return categories;
        },
        {
          [FormattingButtonCategory.primary]: [],
          [FormattingButtonCategory.secondary]: [],
          [FormattingButtonCategory.tertiary]: [],
          [FormattingButtonCategory.headers]: [],
          [FormattingButtonCategory.colors]: [],
          [FormattingButtonCategory.justification]: [],
        },
      ),
    [],
  );

  return (
    <>
      {categories.primary.map(([, props]) => (
        <FormattingButton {...props} disabled={disabled} key={props.name} />
      ))}
      {
        <DropDownButton
          buttons={categories.headers.map(([, props]) => ({
            element: (
              <FormattingButton
                {...props}
                disabled={disabled}
                key={props.name}
              />
            ),
            key: props.name,
          }))}
          md={md}
          onToggle={onDropdownToggle}
        />
      }
      {categories.secondary.map(([, props]) => (
        <FormattingButton {...props} disabled={disabled} key={props.name} />
      ))}
      {
        <DropDownButton
          buttons={categories.justification.map(([, props]) => ({
            element: (
              <FormattingButton
                {...props}
                disabled={disabled}
                key={props.name}
              />
            ),
            key: props.name,
          }))}
          md={md}
          onToggle={onDropdownToggle}
        />
      }
      {categories.colors.map(([hk, props]) => (
        <ToolbarColorInput
          key={hk.type}
          id={hk.type}
          disabled={disabled}
          icon={props.icon}
          onChange={value => {
            execK({
              style: {
                ...props.execCommandArguments.style,
                value,
              },
            });
          }}
        />
      ))}
      {categories.tertiary.map(([, props]) => (
        <FormattingButton {...props} disabled={disabled} key={props.name} />
      ))}
    </>
  );
};
const _ = connector(Buttons);
const M = memo(_);
export { M as Buttons };
