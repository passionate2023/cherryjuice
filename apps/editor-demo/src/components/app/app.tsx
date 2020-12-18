import * as React from 'react';
import { Toolbar } from '::root/app/components/toolbar/toolbar';
import { modApp } from '::sass-modules';
// @ts-ignore
import modTheme from '::sass-modules/../themes/themes.scss';
import '::assets/styles/body.scss';
import '::assets/styles/base.scss';
import '::assets/styles/css-variables/css-variables.scss';
import { Editor } from '::root/app/components/editor/editor';
import { document1 } from '::root/app/components/editor/data/document1';

type Props = {};
export const App: React.FC<Props> = () => {
  return (
    <div className={modTheme.lightTheme}>
      <div className={modApp.app}>
        <Toolbar />
        <Editor document={document1} />
      </div>
    </div>
  );
};
