import { useEffect } from 'react';
import { modRichText } from '::sass-modules';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, filter, map, withLatestFrom } from 'rxjs/operators';
import { ac, store } from '::store/store';
import { onLinkClicked } from '::root/components/app/components/editor/document/components/rich-text/helpers/links';
import { LinkType } from '::root/components/app/components/menus/dialogs/link/reducer/reducer';

const anchor = 'rich-text__anchor';
const link = 'rich-text__link';
const imageLink = 'rich-text__image--link';
const codebox = 'rich-text__code';
const watchedElements = {
  a: true,
  img: true,
  code: true,
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

const editAnchor = (id: string) => {
  ac.editor.setAnchorId(id);
  ac.dialogs.showAnchorDialog();
};

const editLink = (target: HTMLElement) => {
  ac.editor.setSelectedLink({
    href: decodeURIComponent(target['href'] || target.dataset['href']),
    type: target.dataset.type as LinkType,
    target,
  });
  ac.dialogs.showLinkDialog();
};

const editCodebox = (target: HTMLElement) => {
  ac.editor.setSelectedCodebox({
    widthType: +target.dataset['is_width_pix'] === 1 ? 'pixels' : '%',
    width: +target.style.width.replace(/(px|%)/, ''),
    height:
      +target.style.height.replace('px', '') ||
      +target.style.minHeight.replace('px', ''),
    autoExpandHeight: target.style.height ? 'fixed' : 'auto',
    target,
  });
  ac.dialogs.showCodeboxDialog();
};

export const useMouseClick = () => {
  useEffect(() => {
    const element = document.querySelector(
      `.${modRichText.richText__container}`,
    );
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
        if (clickDuration >= 300) {
          if (isAnchor) {
            const id = target.getAttribute('id');
            editAnchor(id);
          } else if (isSimpleLink || isImageLink) {
            editLink(target);
          } else if (isCodebox) {
            editCodebox(target);
          }
        } else {
          if (isSimpleLink || isImageLink) {
            onLinkClicked(target, store.getState().document.documentId);
          }
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
};
