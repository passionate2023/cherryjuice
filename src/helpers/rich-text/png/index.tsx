type Props = {
  offset: number;
  height: number;
  width: number;
  node_id: number;
  file_id: string;
};

const Png = ({ height, width, node_id, offset, file_id }) => {
  return `
    <div style=" width:${width}; height:${height} ; display: inline-block">
      <img
        data-query-params="${JSON.stringify({node_id,offset,file_id})}"
        alt=""
        style=" width:${width}; height:${height} ;"
      />
    </div>
  `;
};

export { Png };
