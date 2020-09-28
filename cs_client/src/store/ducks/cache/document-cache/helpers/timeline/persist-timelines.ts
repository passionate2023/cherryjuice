import { PersistedFrame } from '::store/ducks/cache/document-cache/helpers/timeline/timeline';
import { TimelinesDict } from '::store/ducks/cache/document-cache/helpers/timeline/timelines-manager';

export type PersistedTimelinesDict<T> = {
  [id: string]: PersistedFrame<T>;
};

const key = 'manual-persist:timelines';

const getPersistedTimelines = <T>(): {
  timelines: PersistedTimelinesDict<T>;
  current: string;
} => {
  const persisted = localStorage.getItem(key);
  if (persisted) {
    return JSON.parse(persisted);
  }
};

const persistTimelines = <T>(
  timelines: TimelinesDict<T>,
  current: string,
): void => {
  localStorage.setItem(key, JSON.stringify({ timelines, current }));
};
const resetPersistTimelines = (): void => {
  localStorage.removeItem(key);
};

export const timelinesPersistence = {
  persist: persistTimelines,
  reset: resetPersistTimelines,
  get: getPersistedTimelines,
};
