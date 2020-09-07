import * as React from 'react';
import { modRecentNodes } from '::sass-modules';

type Props = {
  node_title_styles: string;
  name: string;
};

const Title: React.FC<Props> = ({ node_title_styles, name }) => {
  return (
    <div
      className={modRecentNodes.titleAndRecentNodes__title}
      style={node_title_styles && JSON.parse(node_title_styles)}
    >
      {name}
    </div>
  );
};

export { Title };
