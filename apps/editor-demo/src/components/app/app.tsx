import * as React from 'react';
import { modApp } from '::sass-modules';
// @ts-ignore
import modTheme from '::sass-modules/../themes/themes.scss';
import '::assets/styles/body.scss';
import '::assets/styles/base.scss';
import '::assets/styles/css-variables/css-variables.scss';
import { Editor } from '::root/app/components/editor/editor';
import { document1 } from '::root/app/components/editor/data/document1';
import { useRegisterHotkeys } from '::root/app/hooks/register-hotkeys';

type Props = {};
export const App: React.FC<Props> = () => {
  useRegisterHotkeys();
  return (
    <div className={modTheme.lightTheme}>
      <div className={modApp.app}>
        <Editor document={document1} />
      </div>
    </div>
  );
};
