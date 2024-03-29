import { extractTable } from '::helpers/rendering/html-to-ahtml/extractors/table';
import { extractImage } from '::helpers/rendering/html-to-ahtml/extractors/img';
import { extractCodeBox } from '::helpers/rendering/html-to-ahtml/extractors/code-box';
import { extractLink } from '::helpers/rendering/html-to-ahtml/extractors/link';
import { extractText } from '::helpers/rendering/html-to-ahtml/extractors/text';
import { flattenDDOEs } from '::helpers/rendering/html-to-ahtml/steps/flatten-ddoe';
import {
  getTags,
  GetTagsState,
  reduceIntoLines,
} from '::helpers/rendering/html-to-ahtml/helpers/helpers';
import { extractAnchor } from '::helpers/rendering/html-to-ahtml/extractors/anchor';

type GetAhtmlOptions = {
  useObjForTextNodes?: boolean;
  serializeNonTextElements?: boolean;
  reduceLines?: boolean;
  swappedImageIds?: {
    [temporaryId: string]: string;
  };
  removeAttributes?: boolean;
};
type TProps = {
  DDOEs: Node[];
  options?: GetAhtmlOptions;
};
const getAHtml = ({ DDOEs, options = {} }: TProps) => {
  const { DDOEsChildren, DDOEsAHtml } = flattenDDOEs({ DDOEs });
  const state = {
    /*offset: 0,*/ selectionContainsLinks: false,
    imageIDs: new Set(),
  };

  const abstractHtml = (DDOEsChildren as any[]).reduce((acc, el) => {
    if (el.nodeType === Node.ELEMENT_NODE || el.nodeType === Node.TEXT_NODE) {
      if (el.localName === 'br') {
        acc.push('\n');
      } else {
        const getTagsState: GetTagsState = {
          link_attributes: undefined,
        };
        const tags = {
          tags:
            el.nodeType === Node.ELEMENT_NODE
              ? getTags([], getTagsState)(el)
              : [],
        };
        const elementHasChildAnchor =
          el.localName !== 'a' && getTagsState.link_attributes;
        if (elementHasChildAnchor) {
          tags['other_attributes'] = getTagsState.link_attributes;
        }
        if (el.localName === 'code' && el.classList.contains('rich-text__code'))
          extractCodeBox(acc, el, tags, options);
        else if (el.localName === 'img') {
          el.classList.contains('rich-text__anchor') &&
          !options.serializeNonTextElements
            ? extractAnchor(acc, el)
            : extractImage(acc, el, tags, options, state);
        } else if (el.localName === 'table') {
          extractTable(acc, el, tags, options, getAHtml);
        } else if (el.localName === 'a') {
          extractLink(acc, el, tags, state);
        } else {
          acc = extractText(acc, el, tags, options);
        }
      }
    }
    return acc;
  }, []);
  return {
    DDOEsAHtml,
    abstractHtml: options.reduceLines
      ? reduceIntoLines(abstractHtml)
      : abstractHtml,
    selectionContainsLinks: state.selectionContainsLinks,
    imageIDs: state.imageIDs,
  };
};

export { getAHtml };
export { GetAhtmlOptions };
