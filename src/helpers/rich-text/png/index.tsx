type Props = {
  offset: number;
  height: number;
  width: number;
  node_id: number;
  file_id: string;
};

const Png = ({ height, width, node_id, offset, file_id }) => {
  return `<div style=" width:${width}; height:${height} ; display: inline-block">
      <img src=""
        
        alt=""
        style=" width:${width}; height:${height} ;"
      />
    </div>`;
};

export { Png };
