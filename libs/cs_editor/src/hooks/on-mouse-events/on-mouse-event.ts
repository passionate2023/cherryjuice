import { useEffect } from 'react';
import { modEditor } from '::sass-modules';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, filter, map, withLatestFrom } from 'rxjs/operators';
import { onLinkClicked } from '::hooks/on-mouse-events/helpers/links';
import { bridge } from '::root/bridge';

const anchor = 'rich-text__anchor';
const link = 'rich-text__link';
const imageLink = 'rich-text__image--link';
const codebox = 'rich-text__code';
const table = 'rich-text__table';
const watchedElements = {
  a: true,
  img: true,
  code: true,
  table: true,
};

const clickify$ = (
  start$: Observable<Event>,
  end$: Observable<Event>,
): [Observable<[Event, number]>, Observable<[Event, number]>] => {
  const state = {
    latestMouseDownTimeStamp: 0,
  };
  const click$ = end$.pipe(
    withLatestFrom(start$),
    filter(tuple => tuple[1].timeStamp !== state.latestMouseDownTimeStamp),
    map<[Event, Event], [Event, number]>(tuple => {
      const [up, down] = tuple;
      state.latestMouseDownTimeStamp = down.timeStamp;
      return [down, up.timeStamp - down.timeStamp];
    }),
  );

  const hold$ = start$.pipe(
    debounceTime(300),
    filter(e => e['timeStamp'] !== state.latestMouseDownTimeStamp),
    map<Event, [Event, number]>(down => {
      state.latestMouseDownTimeStamp = down.timeStamp;
      return [down, 300];
    }),
  );

  return [click$, hold$];
};

const getValidTarget = (e: Event): HTMLElement =>
  Array.from(e['path']).find(
    el => watchedElements[el['localName']],
  ) as HTMLElement;

const isLeftClick = (e: MouseEvent): boolean => e['which'] === 1;

export const useOnMouseEvents = () => {
  useEffect(() => {
    const element = document.querySelector(`.${modEditor.editor__container}`);
    const md$ = fromEvent(element, 'mousedown').pipe(filter(isLeftClick));
    const mu$ = fromEvent(element, 'mouseup').pipe(filter(isLeftClick));
    const [mouseClick$, mouseHold$] = clickify$(md$, mu$);

    const ts$ = fromEvent(element, 'touchstart');
    const te$ = fromEvent(element, 'touchend');
    const [touchClick$, touchHold$] = clickify$(ts$, te$);
    const subscription = merge(
      mouseClick$,
      mouseHold$,
      touchClick$,
      touchHold$,
    ).subscribe(([e, clickDuration]) => {
      const target = getValidTarget(e);
      if (target) {
        e.preventDefault();
        const isAnchor = target.className === anchor;
        const isSimpleLink = !isAnchor && target.classList[0] === link;
        const isImageLink =
          !isSimpleLink && target.classList.contains(imageLink);
        const isCodebox = !isImageLink && target.classList[0] === codebox;
        const isTable = !isCodebox && target.classList[0] === table;
        if (clickDuration >= 300) {
          if (isAnchor) {
            const id = target.getAttribute('id');
            bridge.current.editAnchor(id);
          } else if (isSimpleLink || isImageLink) {
            bridge.current.editLink(target);
          } else if (isCodebox) {
            bridge.current.editCodebox(target);
          } else if (isTable) {
            bridge.current.editTable(target as HTMLTableElement);
          }
        } else {
          if (isSimpleLink || isImageLink) {
            onLinkClicked(target, bridge.current.getDocumentId());
          }
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
};
