import * as React from 'react';
import { useMemo, useRef } from 'react';
import { onPaste } from '::helpers/clipboard/on-paste';
import { onKeyDown } from '::helpers/typing';
import {
  createGesturesHandler,
  GestureHandlerProps,
} from '@cherryjuice/shared-helpers';
import { useOnMouseEvents } from '::hooks/on-mouse-events/on-mouse-event';
import './assets/styles/global-classes/global-classes.scss';
import { modEditor } from '::sass-modules';
import { useRenderPage } from '::hooks/render-page';
import { ContentEditableProps } from '::helpers/pages-manager/helpers/render-page/render-page';

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
  const ref = useRef<HTMLDivElement>();
  const { onTouchEnd, onTouchStart } = useMemo(
    () => createGesturesHandler(gestureHandlerProps),
    [],
  );
  useOnMouseEvents();
  useRenderPage(contentEditableProps, loading);
  return (
    <div
      className={modEditor.editor}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onPaste={onPaste}
      onKeyDown={onKeyDown}
      id={'editor'}
      ref={ref}
    >
      {loading && fallbackComponent}
    </div>
  );
};
export { Editor };
