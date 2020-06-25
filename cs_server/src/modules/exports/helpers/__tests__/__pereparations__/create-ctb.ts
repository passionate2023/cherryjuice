import { ExportCTB } from '../../export-ctb';

const createCTB = async (documentName, userId, debugOptions = {}): Promise<ExportCTB> => {
  const exportCtb = new ExportCTB(documentName, userId, debugOptions);
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
