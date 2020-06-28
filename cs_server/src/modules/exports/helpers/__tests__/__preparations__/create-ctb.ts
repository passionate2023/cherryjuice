import { DebugOptions, DocumentMeta, ExportCTB } from '../../export-ctb';

const createCTB = async (
  documentMeta: DocumentMeta,
  debugOptions: DebugOptions = {},
): Promise<ExportCTB> => {
  const exportCtb = new ExportCTB(documentMeta, debugOptions);
  try {
    await exportCtb.createCtb();
    await exportCtb.createTables();
  } catch (e) {
    await exportCtb.getDb.exec(
      ['node', 'codebox', 'children', 'grid', 'image']
        .map(table => `delete from "main"."${table}"`)
        .join(';'),
    );
  }
  return exportCtb;
};

export { createCTB };
