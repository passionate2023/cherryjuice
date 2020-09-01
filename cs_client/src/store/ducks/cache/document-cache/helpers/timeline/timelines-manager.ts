import {
  OnFrameChange,
  Timeline,
  TimelineFrameMeta,
} from '::store/ducks/cache/document-cache/helpers/timeline/timeline';
import { Patch } from 'immer';

export class TimelinesManager<T> {
  private timelines: { [id: string]: Timeline<T> };
  current: Timeline<T>;
  private onFrameChange: OnFrameChange<T>;
  constructor() {
    this.timelines = {};
  }

  setOnFrameChangeFactory(
    onFrameChangeFactory?: () => Promise<OnFrameChange<T>>,
  ): void {
    onFrameChangeFactory().then(
      onFrameChange => (this.onFrameChange = onFrameChange),
    );
  }

  private addTimeline = (id: string): void => {
    this.timelines[id] = new Timeline(this.onFrameChange);
  };
  addFrame = (meta: TimelineFrameMeta<T> & { timelineId: string }) => (
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
