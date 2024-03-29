import * as React from 'react';
import mod from './row-element.scss';
import { Icon, IconName } from '@cherryjuice/icons';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { InlineInput } from '::shared-components/inline-input/inline-input';
import { useContext, useRef } from 'react';
import { FolderContext } from '::app/components/home/components/folder/folder';
import { Tooltip } from '@cherryjuice/components';

export type RowElementsProps = {
  text: string;
  icon?: IconName;
  tooltip?: string;
  onClick?: () => void;
  isHead?: boolean;
  rowIsCollapsed?: boolean;
};

export const RowElement: React.FC<RowElementsProps & { rowId?: string }> = ({
  text,
  icon,
  onClick,
  isHead,
  rowIsCollapsed,
  rowId,
  tooltip,
}) => {
  const inlineInputProps = useContext(FolderContext);

  const spanRef = useRef<HTMLSpanElement>();
  const spanWidthRef = useRef(0);
  if (spanRef.current) spanWidthRef.current = spanRef.current.clientWidth;
  return (
    <Tooltip tooltip={tooltip}>
      {bind => (
        <span
          onClick={onClick}
          className={joinClassNames([
            mod.rowElement,
            [mod.rowElementHead, isHead],
            [mod.rowElementCollapsedRow, rowIsCollapsed],
          ])}
          {...bind}
        >
          {rowId && inlineInputProps?.currentlyEnabledInput === rowId ? (
            <InlineInput
              initialValue={text}
              checkValidity={inlineInputProps.checkValidity}
              onAcceptInput={inlineInputProps.disableInput(rowId, text)}
              className={mod.rowElement__input}
              width={spanWidthRef.current}
            />
          ) : (
            <span ref={spanRef}>{text}</span>
          )}
          {icon && <Icon name={icon} size={16} />}
        </span>
      )}
    </Tooltip>
  );
};
