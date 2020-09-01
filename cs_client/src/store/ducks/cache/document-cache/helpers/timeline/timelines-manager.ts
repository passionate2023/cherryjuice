import { OnFrameChange } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';
import {
  Timeline,
  TimelineFrameMeta,
} from '::store/ducks/cache/document-cache/helpers/timeline/timeline';
import { Patch } from 'immer';

export class TimelinesManager {
  private timelines: { [id: string]: Timeline };
  current: Timeline;
  private onFrameChange: OnFrameChange;
  constructor() {
    this.timelines = {};
  }

  setOnFrameChangeFactory(
    onFrameChangeFactory?: () => Promise<OnFrameChange>,
  ): void {
    onFrameChangeFactory().then(
      onFrameChange => (this.onFrameChange = onFrameChange),
    );
  }

  private addTimeline = (id: string): void => {
    this.timelines[id] = new Timeline(this.onFrameChange);
  };
  addFrame = (meta: TimelineFrameMeta & { timelineId: string }) => (
    patches: Patch[],
    reversePatches: Patch[],
  ): void => {
    this.setCurrent(meta.timelineId);
    delete meta.timelineId;
    this.current.add(meta)(patches, reversePatches);
  };

  private setCurrent = (id: string): void => {
    if (!this.timelines[id]) this.addTimeline(id);
    this.current = this.timelines[id];
  };

  resetAll = () => {
    this.timelines = {};
  };

  resetTimeline = (id: string): void => {
    delete this.timelines[id];
  };
}
