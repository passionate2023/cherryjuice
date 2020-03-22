import * as React from 'react';
import toolbarMod from '::sass-modules/tool-bar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

const ToolbarButton: React.FC<{
  onClick?: any;
  enabled?: boolean;
  fontAwesomeProps?: { icon: IconDefinition; color: string };
}> = ({ onClick, children, enabled, fontAwesomeProps }) => (
  <div
    className={`${toolbarMod.toolBar__icon} ${
      enabled ? toolbarMod.toolBar__iconEnabled : ''
    }`}
    {...(onClick && { onClick })}
  >
    {fontAwesomeProps ? (
      <FontAwesomeIcon
        icon={fontAwesomeProps.icon}
        color={fontAwesomeProps.color}
      />
    ) : (
      children
    )}
  </div>
);

export { ToolbarButton };
