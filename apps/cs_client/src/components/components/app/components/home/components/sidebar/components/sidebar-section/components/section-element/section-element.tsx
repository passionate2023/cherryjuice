import * as React from 'react';
import mod from './section-element.scss';
import { Icon, IconName } from '@cherryjuice/icons';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { ac } from '::store/store';
import { InlineInput } from '::shared-components/inline-input/inline-input';
import { Droppable } from '::app/components/editor/document/components/tree/components/node/_/droppable';
import { modRow } from '::app/components/home/components/folder/components/sections/components/section/componnets/row/row';
import { InlineInputProps } from '::shared-components/inline-input/hooks/inline-input-provider';

export type ElementState = 'opened';
export type SectionElementProps = {
  text: string;
  id: string;
  icon?: IconName;
  state?: ElementState;
  restrictions?: {
    contextMenu?: boolean;
    renaming?: boolean;
    dnd?: boolean;
  };
};

export type SharedSectionElementProps = {
  onClick: (id: string) => void;
};
export const SectionElement: React.FC<
  SectionElementProps &
    SharedSectionElementProps & { inlineInputProps: InlineInputProps }
> = ({
  id,
  text,
  icon,
  state,
  restrictions = {},
  onClick,
  inlineInputProps,
}) => {
  return (
    <Droppable
      anchorId={id}
      anchorClassName={modRow.row}
      onDrop={({ dest, source }) => {
        ac.documentCache.mutateDocument({
          documentId: source.id,
          meta: { folderId: dest.id },
        });
      }}
      onDragEnterStyleClass={mod.sectionElementDragEnter}
    >
      {(provided, ref) => (
        <div
          className={joinClassNames([
            mod.sectionElement,
            [mod.sectionElementOpened, state === 'opened'],
          ])}
          onDoubleClick={inlineInputProps.enableInput(id)}
          ref={ref}
          {...(!restrictions.dnd && provided)}
          data-id={restrictions.contextMenu ? undefined : id}
          onClick={() => onClick(id)}
        >
          <span className={mod.sectionElement__content}>
            {icon && <Icon name={icon} />}
            {!restrictions.renaming &&
            inlineInputProps.currentlyEnabledInput === id ? (
              <InlineInput
                initialValue={text}
                checkValidity={inlineInputProps.checkValidity}
                onAcceptInput={inlineInputProps.disableInput(id, text)}
                className={
                  mod.sectionElement__text +
                  ' ' +
                  mod.sectionElement__inlineInput
                }
              />
            ) : (
              <span className={mod.sectionElement__text}>{text}</span>
            )}
          </span>
        </div>
      )}
    </Droppable>
  );
};

export { mod as modSectionElement };
