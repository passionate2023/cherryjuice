import * as React from 'react';
import {
  ContentEditable,
  ContentEditableProps,
} from '::root/components/content-editable/content-editable';
import { useMemo } from 'react';
import { onPaste } from '::helpers/clipboard/on-paste';
import { onKeyDown } from '::helpers/typing';
import {
  createGesturesHandler,
  GestureHandlerProps,
} from '@cherryjuice/shared-helpers';
import { useOnMouseEvents } from '::hooks/on-mouse-events/on-mouse-event';
import { useScrollToHash } from '::hooks/scroll-to-hash';
import './assets/styles/global-classes/global-classes.scss';
import { modEditor } from '::sass-modules';

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
      className={modEditor.editor}
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
