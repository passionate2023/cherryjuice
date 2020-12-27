import { OnFrameChange } from '::helpers/snapback/snapback/snapback';
import { bridge } from '::root/bridge';
import {
  PagesManagerConfiguration,
  STimer,
} from '::helpers/pages-manager/pages-manager';

export const onFrameChangeFactory = (
  onFrameChange: OnFrameChange,
  cachePage: (id: string) => void,
  pmConfig: PagesManagerConfiguration,
): OnFrameChange => {
  let frameTs;
  let autoSaveTimer: STimer;
  return (nof, meta) => {
    if (frameTs === meta.currentFrameTs) return;
    frameTs = meta.currentFrameTs;
    onFrameChange(nof, meta);
    if (pmConfig.autoSaveInterval > 100) {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        cachePage(meta.id);
      }, pmConfig.autoSaveInterval);
    }
    if (nof.undo < 2) {
      const [documentId, node_id] = meta.id.split('/');
      bridge.current.flagEditedNode({
        documentId,
        node_id: +node_id,
        changed: !!nof.undo,
      });
    }
  };
};
