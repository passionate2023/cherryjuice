import { useEffect } from 'react';
import { modRichText } from '::sass-modules';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { ac, store } from '::store/store';
import { onLinkClicked } from '::root/components/app/components/editor/document/components/rich-text/helpers/links';

const anchor = 'rich-text__anchor';
const link = 'rich-text__link';
const imageLink = 'rich-text__image--link';
const watchedElements = {
  a: true,
  img: true,
};
export const useMouseClick = () => {
  useEffect(() => {
    const state = {
      latestMouseDownTimeStamp: 0,
    };
    const element = document.querySelector(
      `.${modRichText.richText__container}`,
    );
    const simpleClick = fromEvent(element, 'click')
      .pipe(
        filter(e => e['which'] === 1),
        tap(e => e.preventDefault()),
      )
      .subscribe();
    const md$ = fromEvent(element, 'mousedown').pipe(
      filter(e => e['which'] === 1),
      tap(e => e.preventDefault()),
    );
    const mu$ = fromEvent(element, 'mouseup').pipe(
      filter(e => e['which'] === 1),
      tap(e => e.preventDefault()),
    );
    const click$ = mu$.pipe(
      withLatestFrom(md$),
      filter(tuple => tuple[1].timeStamp !== state.latestMouseDownTimeStamp),
      map<[Event, Event], [Event, number]>(tuple => [
        tuple[1],
        tuple[0].timeStamp - tuple[1].timeStamp,
      ]),
    );

    const hold$ = md$.pipe(
      debounceTime(300),
      filter(e => e.timeStamp !== state.latestMouseDownTimeStamp),
      map<Event, [Event, number]>(e => [e, 300]),
    );

    const subscription = merge(click$, hold$).subscribe(
      ([e, clickDuration]) => {
        state.latestMouseDownTimeStamp = e.timeStamp;
        const target = Array.from(e['path']).find(
          el => watchedElements[el['localName']],
        ) as HTMLElement;
        if (target) {
          e.preventDefault();
          if (clickDuration >= 300) {
            if (target.className === anchor) {
              const id = target.getAttribute('id');
              ac.editor.setAnchorId(id);
              ac.dialogs.showAnchorDialog();
            }
          } else {
            if (
              target.classList[0] === link ||
              target.classList.contains(imageLink)
            ) {
              onLinkClicked(target, store.getState().document.documentId);
            }
          }
        }
      },
    );
    return () => {
      subscription.unsubscribe();
      simpleClick.unsubscribe();
    };
  }, []);
};
