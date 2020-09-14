import {
  OnFrameChange,
  PersistedFrame,
  Timeline,
  TimelineFrameMeta,
} from '::store/ducks/cache/document-cache/helpers/timeline/timeline';
import { Patch } from 'immer';
import { timelinesPersistence } from '::store/ducks/cache/document-cache/helpers/timeline/persist-timelines';

export type TimelinesDict<T> = { [id: string]: Timeline<T> };

export class TimelinesManager<T> {
  private timelines: TimelinesDict<T>;
  current: Timeline<T>;
  currentId: string;
  private onFrameChange: OnFrameChange<T>;
  constructor(private readonly persist = false) {
    this.timelines = {};
  }

  private reHydrate = (): void => {
    const persistedTimelines = timelinesPersistence.get<T>();
    if (persistedTimelines?.timelines) {
      Object.entries(persistedTimelines.timelines).forEach(([id, timeline]) => {
        this.addTimeline(id, timeline);
      });
      this.current = this.timelines[persistedTimelines.current];
    }
  };

  setOnFrameChangeFactory(
    onFrameChangeFactory?: () => Promise<OnFrameChange<T>>,
  ): void {
    onFrameChangeFactory().then(onFrameChange => {
      this.onFrameChange = onFrameChange;
      if (this.persist) {
        this.reHydrate();
      }
    });
  }

  private addTimeline = (
    id: string,
    persistedFrame?: PersistedFrame<T>,
  ): void => {
    this.timelines[id] = new Timeline(this.onFrameChange);
    if (persistedFrame) this.timelines[id].reHydrate(persistedFrame);
  };
  addFrame = (meta: TimelineFrameMeta<T> & { timelineId: string }) => (
    patches: Patch[],
    reversePatches: Patch[],
  ): void => {
    const id = meta.timelineId;
    this.setCurrent(id);
    delete meta.timelineId;
    this.current.add(meta)(patches, reversePatches);
    if (this.persist) timelinesPersistence.persist(this.timelines, id);
  };

  setCurrent = (id: string): void => {
    if (!this.timelines[id]) this.addTimeline(id);
    this.current = this.timelines[id];
    this.currentId = id;
  };

  resetAll = () => {
    this.timelines = {};
    this.current = undefined;
    this.currentId = undefined;
    if (this.persist) timelinesPersistence.reset();
  };

  resetTimeline = (id: string): void => {
    delete this.timelines[id];
    const deletingCurrent = id === this.currentId;
    timelinesPersistence.persist(
      this.timelines,
      deletingCurrent ? undefined : this.currentId,
    );
    if (deletingCurrent) {
      this.current = undefined;
      this.currentId = undefined;
    }
  };
}
