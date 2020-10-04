export interface Doc {
  id: string;
  serviceId: string;
  mimeType: string;
  name: string;
  description: string;
  type: string;
  lastEditedUtc: any;
  iconUrl: string;
  url: string;
  embedUrl: string;
  sizeBytes: number;
  parentId: string;
}

export interface GooglePickerResult {
  action: string;
  viewToken: any[];
  docs: Doc[];
}
