import SQL from 'sql-template-strings';

const insertIntoBookmark = ({
  node_id,
  sequence,
}: {
  node_id: number;
  sequence: number;
}) => {
  return SQL`
      INSERT INTO "main"."bookmark" (
      "node_id", "sequence"
      ) VALUES  (
      ${node_id}, ${sequence}
      )`;
};

export { insertIntoBookmark };
