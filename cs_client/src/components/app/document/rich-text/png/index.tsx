import * as React from 'react';
import { usePng } from '::hooks/use-png';
import { useRef } from 'react';

type Props = {
  offset: number;
  height: number;
  width: number;
  node_id: number;
  file_id: string;
};

const Png: React.FC<Props> = ({ height, width, node_id, offset, file_id }) => {
  const png_base64 = usePng({
    file_id,
    node_id,
    offset
  });

  return (
    <div style={{ width, height , display: 'inline-block'}}>
      <img
        src={png_base64 ? `data:image/png;base64,${png_base64.pngs}` : ''}
        alt=""
        style={{ width, height }}
      />
    </div>
  );
};

export { Png };
