import { Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { getHotkeys } from '::store/selectors/cache/settings/hotkeys';
import { connect, ConnectedProps } from 'react-redux';
import * as React from 'react';
import { execK } from '@cherryjuice/editor';
import { ToolbarColorInput } from '@cherryjuice/components';
import { FormattingButton } from '::app/components/editor/editor-toolbar/components/static-editor-toolbar/components/formatting-buttons/components/formatting-button';
import { DropDownButton } from '::shared-components/drop-down-button/drop-down-button';
import { useSortButtons } from '::app/components/editor/editor-toolbar/components/static-editor-toolbar/components/formatting-buttons/hooks/sort-buttons';

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

const FormattingButtons: React.FC<PropsFromRedux> = ({
  selectedNode_id,
  documentId,
  formattingHotKeys,
}) => {
  const disabled = !documentId || !selectedNode_id;

  const categories = useSortButtons(formattingHotKeys);

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
          tooltip={props.name}
        />
      ))}
      {categories.tertiary.map(([, props]) => (
        <FormattingButton {...props} disabled={disabled} key={props.name} />
      ))}
    </>
  );
};
const _ = connector(FormattingButtons);
export { _ as FormattingButtons };
