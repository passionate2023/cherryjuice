import { modRichText } from '::sass-modules';
import * as React from 'react';
import {
  ContentEditable,
  ContentEditableProps,
} from '::editor/components/content-editable/content-editable';
import { useMemo } from 'react';
import { onPaste } from '::editor/helpers/clipboard/on-paste';
import { onKeyDown } from '::editor/helpers/typing';
import {
  createGesturesHandler,
  GestureHandlerProps,
} from '::root/components/shared-components/drawer/components/drawer-navigation/helpers/create-gestures-handler';
import { useOnMouseEvents } from '::editor/hooks/on-mouse-events/on-mouse-event';
import { useScrollToHash } from '::editor/hooks/scroll-to-hash';

type Props = {
  contentEditableProps: ContentEditableProps;
  gestureHandlerProps: GestureHandlerProps;
  fallbackComponent: JSX.Element;
  loading: boolean;
};

const Editor: React.FC<Props> = ({
  gestureHandlerProps,
  contentEditableProps,
  fallbackComponent,
  loading,
}) => {
  const { onTouchEnd, onTouchStart } = useMemo(
    () => createGesturesHandler(gestureHandlerProps),
    [],
  );
  useOnMouseEvents();
  useScrollToHash();
  return (
    <div
      className={modRichText.richText__container}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onPaste={onPaste}
      onKeyDown={onKeyDown}
    >
      {loading ? (
        fallbackComponent
      ) : (
        <ContentEditable {...contentEditableProps} />
      )}
    </div>
  );
};
export { Editor };
