import { saveNodesMeta } from '::app/editor/document/hooks/save-document/helpers/save-nodes-meta';
import { saveNewNodes } from '::app/editor/document/hooks/save-document/helpers/save-new-nodes';
import {
  deleteDanglingNodes,
  saveDeletedNodes,
  SaveOperationState,
} from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { saveNodesContent } from '::app/editor/document/hooks/save-document/helpers/save-nodes-content';
import { saveNewDocument } from '::app/editor/document/hooks/save-document/helpers/save-new-document';
import { saveImages } from '::app/editor/document/hooks/save-document/helpers/save-images';

const saveDocument = async (state: SaveOperationState) => {
  await saveNewDocument({ state });
  await saveDeletedNodes({ state });
  await saveNewNodes({ state });
  await saveNodesMeta({ state });
  await saveImages({ state });
  await saveNodesContent({ state });
  await deleteDanglingNodes({ state });

  return state;
};

export { saveDocument };
