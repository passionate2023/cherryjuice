import { db } from '../index';

const write = ({ table, tuples, node_id, filePath }) => {
  return db.open(filePath).then(db =>
    Promise.all(
      tuples.map(([column, value]) =>
        db.run(` 
    UPDATE ${table} 
    SET ${column} = '${value}' 
    WHERE node_id = ${node_id}`),
      ),
    ),
  );
};

export { write };
