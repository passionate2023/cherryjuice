type EventCreatorProps = {
  type: 'text/html' | 'text/plain' | 'Files';
  value: string | Blob;
};
const eventCreator = ({ type, value }: EventCreatorProps) => {
  const clipboardData = new DataTransfer();
  if (typeof value === 'string') clipboardData.setData(type, value);
  else {
    clipboardData.items.add(new File([value], (value as any).name));
  }
  const pasteEvent = new ClipboardEvent('paste', {
    bubbles: true,
    cancelable: true,
    clipboardData,
  });
  return pasteEvent;
};

export { eventCreator };
export { EventCreatorProps };
