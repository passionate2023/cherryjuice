import { translateTable } from './other-tables';
import { translateText } from './text';
import { translateLink } from './link';

const pseudoHtmlToMidPipe = html =>
  html.nodes.map(node => {
    if (node.$) {
      if (node.type) node = translateTable({ node });
      else if (node.tags.includes('a')) node = translateLink({ node });
      else node = translateText({ node });
    }
    return node;
  });

export { pseudoHtmlToMidPipe };
