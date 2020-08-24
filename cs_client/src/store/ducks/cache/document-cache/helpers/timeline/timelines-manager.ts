import { Timeline } from '::store/ducks/cache/document-cache/helpers/timeline/timeline';

export class TimelinesManager {
  private nodeMetaTimelines: { [documentId: string]: Timeline };
  private readonly documentMetaTimeline: Timeline;
  private documentId: string;

  constructor() {
    this.nodeMetaTimelines = {};
    this.documentMetaTimeline = new Timeline();
  }

  addNodeMetaTimeline = (documentId: string): void => {
    this.nodeMetaTimelines[documentId] = new Timeline();
  };

  setCurrentNodeMetaTimeline = (documentId: string): void => {
    this.documentId = documentId;
  };

  resetDocumentMetaTimeline = () => {
    this.documentMeta.resetAll();
  };
  resetNodeMetaTimelines = () => {
    this.nodeMetaTimelines = {};
  };

  get nodeMeta(): Timeline {
    return this.nodeMetaTimelines[this.documentId];
  }
  get documentMeta(): Timeline {
    return this.documentMetaTimeline;
  }

  resetNodeMetaTimeline = (documentId: string): void => {
    delete this.nodeMetaTimelines[documentId];
    if (this.documentId === documentId) this.documentId = undefined;
  };
}
