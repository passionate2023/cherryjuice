import * as React from 'react';
import mod from './section-element.scss';
import { Icon, IconName } from '@cherryjuice/icons';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { useLayoutEffect } from 'react';
import { ac } from '::store/store';
import {
  CheckValidity,
  InlineInput,
} from '::app/components/home/components/sidebar/components/sidebar-section/components/section-element/components/inline-input';
import {
  OnToggleInput,
  useInlineInput,
} from '::app/components/home/components/sidebar/components/sidebar-section/components/section-element/components/hooks/inline-input';
import { Droppable } from '::app/components/editor/document/components/tree/components/node/_/droppable';
import { modRow } from '::app/components/home/components/folder/components/sections/components/section/componnets/row/row';

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
  checkValidity: CheckValidity;
  currentlyEnabledInput: string;
  onToggleInputMode: OnToggleInput;
  onClick: (id: string) => void;
};
export const SectionElement: React.FC<
  SectionElementProps & SharedSectionElementProps
> = ({
  id,
  text,
  icon,
  state,
  checkValidity,
  currentlyEnabledInput,
  onToggleInputMode,
  restrictions = {},
  onClick,
}) => {
  const { inputMode, enableInput, disableInput } = useInlineInput({
    existingValue: text,
    onApply: value => ac.home.setFolderName({ id, name: value.trim() }),
    onDiscard: () => ac.home.removeFolder({ id }),
    onToggle: onToggleInputMode,
    inputId: id,
  });
  useLayoutEffect(() => {
    if (currentlyEnabledInput === id && !inputMode) enableInput();
  }, [currentlyEnabledInput]);

  return (
    <Droppable
      // childOfAnchor={true}
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
          onDoubleClick={enableInput}
          ref={ref}
          {...(!restrictions.dnd && provided)}
          data-id={restrictions.contextMenu ? undefined : id}
          onClick={() => onClick(id)}
        >
          <span className={mod.sectionElement__content}>
            {icon && <Icon name={icon} />}
            {!restrictions.renaming &&
            (!currentlyEnabledInput || currentlyEnabledInput === id) &&
            inputMode ? (
              <InlineInput
                initialValue={text}
                checkValidity={checkValidity}
                onAcceptInput={disableInput}
                autoFocus={true}
                className={mod.sectionElement__text}
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
