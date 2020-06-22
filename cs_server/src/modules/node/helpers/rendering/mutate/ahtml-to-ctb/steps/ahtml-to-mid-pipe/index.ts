import { translateTable } from './other-tables';
import { translateText } from './text';
import { translateLink } from './link';
import { AHtmlLine, AHtmlNode } from '../../../../query/ahtml-to-html';

const aHtmlToMidPipe = (aHtmls: AHtmlLine[]): AHtmlNode[] =>
  aHtmls.flatMap(([line]) =>
    line.map(node => {
      if (node.type) node = translateTable({ node });
      else if (typeof node === 'object')
        if (node.tags?.includes('a')) node = translateLink({ node });
        else node = translateText({ node });
      return node;
    }),
  );

export { aHtmlToMidPipe };
