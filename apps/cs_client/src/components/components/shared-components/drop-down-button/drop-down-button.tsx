import * as React from 'react';
import mod from './drop-down-button.scss';
import { useRef } from 'react';
import { Icon } from '@cherryjuice/icons';
import { ContextMenuWrapper } from '@cherryjuice/components';

const List = ({
  buttons,
  selectButton,
  previouslySelected,
  hide,
}: {
  buttons: Button[];
  selectButton: (i: number) => void;
  previouslySelected: number;
  hide: () => void;
}) => (
  <>
    <div className={mod.list}>
      {buttons.map((button, i) =>
        i !== previouslySelected ? (
          <div
            key={button.key}
            onClick={() => {
              selectButton(i);
              hide();
            }}
            className={mod.list__item}
          >
            {button.element}
          </div>
        ) : undefined,
      )}
    </div>
  </>
);

type Button = { key: string; element: JSX.Element };
type Props = {
  buttons: Button[];
  collapseOnInsideClick?: boolean;
};

const noop = () => undefined;

export const DropDownButton: React.FC<Props> = ({
  buttons,
  collapseOnInsideClick,
}) => {
  const previouslySelected = useRef(0);
  const selectButton = i => {
    previouslySelected.current = i;
  };

  return (
    <ContextMenuWrapper
      customBody={({ hide }) => {
        return (
          <List
            buttons={buttons}
            hide={collapseOnInsideClick ? hide : noop}
            previouslySelected={previouslySelected.current}
            selectButton={selectButton}
          />
        );
      }}
      hookProps={{
        getIdOfActiveElement: () => 'drop-down',
        getActiveElement: target => target.closest('.' + mod.dropDownButton),
      }}
      positionPreferences={{ positionY: 'bt', positionX: 'll' }}
      style={{ paddingTop: 0, paddingBottom: 0, borderRadius: 0 }}
    >
      {({ show }) => (
        <div className={mod.dropDownButton}>
          <div className={mod.head}>
            {buttons[previouslySelected.current].element}
            <div onClick={show} className={mod.head__arrow}>
              <Icon name={'arrow-down'} size={14} />
            </div>
          </div>
        </div>
      )}
    </ContextMenuWrapper>
  );
};
