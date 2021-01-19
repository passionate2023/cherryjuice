import * as React from 'react';
import mod from './home.scss';
import { Folder } from '::app/components/home/components/folder/folder';

type Props = Record<string, never>;

const Home: React.FC<Props> = () => {
  return (
    <div className={mod.home}>
      <Folder />
    </div>
  );
};

export default Home;
