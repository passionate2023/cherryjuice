import * as React from 'react';
import { modApp } from '::sass-modules';
import '::assets/styles/body.scss';
import '::assets/styles/base.scss';
import '::assets/styles/css-variables/css-variables.scss';
import { Editor } from '::root/app/components/editor/editor';
import { document1 } from '::root/app/components/editor/data/document1';
import { useRegisterHotkeys } from '::root/app/components/editor/hooks/register-hotkeys';
import { setPopperAnchor } from '@cherryjuice/components';
setPopperAnchor('.' + modApp.app);
import modTheme from '@cherryjuice/shared-styles/build/themes/themes.scss';
export const App: React.FC = () => {
  useRegisterHotkeys();
  return (
    <div className={modTheme.lightTheme}>
      <div className={modApp.app}>
        <Editor document={document1} />
      </div>
    </div>
  );
};
