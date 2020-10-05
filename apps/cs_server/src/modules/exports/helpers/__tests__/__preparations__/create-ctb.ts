import { DebugOptions, DocumentMeta, ExportCTB } from '../../export-ctb';

const createCTB = async (
  documentMeta: DocumentMeta,
  debugOptions: DebugOptions = {},
): Promise<ExportCTB> => {
  const exportCtb = new ExportCTB(documentMeta, debugOptions);
  await exportCtb.createCtb();
  await exportCtb.createTables();
  return exportCtb;
};

export { createCTB };
