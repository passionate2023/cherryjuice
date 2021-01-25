import * as React from 'react';
import mod from './sidebar-section.scss';
import {
  SharedSectionElementProps,
  SectionElement,
  SectionElementProps,
} from '::app/components/home/components/sidebar/components/sidebar-section/components/section-element/section-element';
import {
  SectionHeader,
  SectionHeaderProps,
} from '::app/components/home/components/sidebar/components/sidebar-section/components/section-header/section-header';

type Props = {
  topBorder?: boolean;
  elements: SectionElementProps[];
  header?: SectionHeaderProps;
  sharedSectionElementProps: SharedSectionElementProps;
};

export const SidebarSection: React.FC<Props> = ({
  header,
  elements,
  topBorder,
  sharedSectionElementProps,
}) => {
  return (
    <div className={mod.sidebarSection}>
      {topBorder && <span className={mod.sidebarSection__border} />}
      {header && <SectionHeader {...header} />}
      {elements.map(element => (
        <SectionElement
          {...element}
          key={element.id}
          {...sharedSectionElementProps}
        />
      ))}
    </div>
  );
};
