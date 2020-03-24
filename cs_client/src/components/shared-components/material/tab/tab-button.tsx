import * as React from 'react';
import { useCallback } from 'react';

type ScreenButton = {
  selectedScreenTitle: string;
  title: string;
  icon?: HTMLElement;
  setSelectedScreenTitle: Function;
};

const TabButton: React.FC<ScreenButton> = ({
  setSelectedScreenTitle,
  selectedScreenTitle,
  title,
  icon,
}) => {
  const isSelected = selectedScreenTitle === title;
  const onClick = useCallback(() => setSelectedScreenTitle(title), []);
  return (
    <button
      className={`mdc-tab ${isSelected ? 'mdc-tab--active' : ''}`}
      role="tab"
      aria-selected={isSelected}
      tabIndex={-1}
      onClick={onClick}
    >
      <span className="mdc-tab__content">
        {icon && (
          <span className="mdc-tab__icon material-icons" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="mdc-tab__text-label">{title}</span>
      </span>
      <span
        className={`mdc-tab-indicator ${
          isSelected ? 'mdc-tab-indicator--active' : ''
        }`}
      >
        <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline" />
      </span>
      <span className="mdc-tab__ripple" />
    </button>
  );
};

export { TabButton, ScreenButton };
