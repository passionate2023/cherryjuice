import * as React from 'react';
import { SettingsScreen } from '::app/components/menus/dialogs/settings/shared/settings-screen';
import { SettingsElement } from '::app/components/menus/dialogs/settings/shared/settings-element';
import { SettingsGroup } from '::app/components/menus/dialogs/settings/shared/settings-group';
import { InformationLink } from '::app/components/menus/dialogs/settings/screens/about/components/components/information-link/information-link';
import { InformationText } from '::app/components/menus/dialogs/settings/screens/about/components/components/information-text/information-text';

const repoLink = 'https://github.com/ycnmhd/cherryjuice';
const groups = [
  {
    name: 'build',
    info: [
      { label: 'build date', text: process.env.BUILD_DATE || '-' },
      {
        label: 'commit',
        text: (process.env.COMMIT_SHA || '-').substring(0, 10),
        link: process.env.COMMIT_SHA
          ? repoLink + '/commit/' + process.env.COMMIT_SHA
          : undefined,
      },
    ],
  },
  {
    name: 'project',
    info: [
      {
        label: 'Licence',
        text: 'GNU AGPL version 3',
        link: repoLink + '/blob/master/LICENSE',
      },
      {
        label: 'Home Page',
        text: repoLink,
        link: repoLink,
      },
    ],
  },
];

export const About: React.FC = () => {
  return (
    <SettingsScreen>
      {groups.map(({ name, info }) => (
        <SettingsGroup name={name} key={name}>
          {info.map(({ label, text, link }) => (
            <SettingsElement name={label + ':'} key={label}>
              {link ? (
                <InformationLink text={text} link={link} />
              ) : (
                <InformationText text={text} />
              )}
            </SettingsElement>
          ))}
        </SettingsGroup>
      ))}
    </SettingsScreen>
  );
};
