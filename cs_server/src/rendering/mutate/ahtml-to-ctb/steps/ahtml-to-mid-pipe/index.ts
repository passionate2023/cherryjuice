import { translateTable } from './other-tables';
import { translateText } from './text';
import { translateLink } from './link';

const aHtmlToMidPipe = html =>
  html.map(node => {
    console.log({ node });
    if (node.$) {
      if (node.type) node = translateTable({ node });
      else if (node.tags.includes('a')) node = translateLink({ node });
      else node = translateText({ node });
    }
    console.log('result', { node });
    return node;
  });

export { aHtmlToMidPipe };
