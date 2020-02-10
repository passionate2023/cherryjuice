import { abstractHtmlToCtb } from '../../rendering/abstract-html-to-ctb';
import { ctb } from '../../data-access/sqlite/db/ctb';

const setNodeContent = async (
  _,
  { file_id, node_id, abstract_html },
  { files },
) => {
  const { xmlString, otherTables } = abstractHtmlToCtb(
    JSON.parse(abstract_html),
  );
  await ctb.write({
    table: 'node',
    tuples: [['txt', xmlString]],
    node_id,
    filePath: files.get(file_id)?.filePath,
  });
  await Object.entries(otherTables).map(([tableName, rows]) =>
    Promise.all(
      (rows as any[]).map(row =>
        ctb.write({
          table: tableName,
          tuples: Object.entries(row),
          node_id,
          filePath: files.get(file_id)?.filePath,
        }),
      ),
    ),
  );
};

export { setNodeContent };
