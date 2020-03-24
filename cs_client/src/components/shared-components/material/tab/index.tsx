import * as React from 'react';
import { EventHandler } from 'react';
import { TabBar } from '::shared-components/material/tab/tab-bar';
import { TabButton } from '::shared-components/material/tab/tab-button';

type Screens = {
  screens: { [title: string]: JSX.Element };
  selectedScreenTitle: string;
  setSelectedScreenTitle: EventHandler<undefined>;
};

const Tab: React.FC<Screens> = ({
  screens,
  setSelectedScreenTitle,
  selectedScreenTitle,
}) => {
  return (
    <>
      <TabBar>
        {Object.keys(screens).map(title => (
          <TabButton
            key={title}
            title={title}
            selectedTab={selectedScreenTitle}
            setSelectedTab={setSelectedScreenTitle}
          />
        ))}
      </TabBar>
      {screens[selectedScreenTitle]}
    </>
  );
};

export { Tab, Screens };
