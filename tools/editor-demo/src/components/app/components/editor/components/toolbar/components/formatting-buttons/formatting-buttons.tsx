import * as React from 'react';
import { execK, useSortFormattingButtons } from '@cherryjuice/editor';
import { ToolbarColorInput, DropDownButton } from '@cherryjuice/components';
import { FormattingButton } from '::root/app/components/editor/components/toolbar/components/formatting-buttons/components/formatting-button';
import { getDefaultSettings } from '@cherryjuice/default-settings';

const formattingHotkeys = getDefaultSettings().hotKeys.formatting;
const FormattingButtons: React.FC = () => {
  const categories = useSortFormattingButtons(formattingHotkeys);
  const disabled = false;
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
export { FormattingButtons };
