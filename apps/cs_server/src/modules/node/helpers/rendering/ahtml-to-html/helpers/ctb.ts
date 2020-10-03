import path from 'path';
type LinkAttributes = {
  href: string;
  target: string;
  'data-type': string;
  class: string;
};
const parseLink = c => {
  const attributes: LinkAttributes = {
    href: '',
    target: '_blank',
    'data-type': '',
    class: '',
  };
  if (c.startsWith('node')) {
    const [, id, anchor] = /node (\d+) *(.+)?/.exec(c);
    attributes.href = `${id}${anchor ? `#${encodeURIComponent(anchor)}` : ''}`;
    attributes['data-type'] = 'node';
  } else if (c.startsWith('webs')) {
    const [, url] = /webs (.+)/.exec(c);
    attributes.href = url;
    attributes['data-type'] = 'web';
  } else if (c.startsWith('file')) {
    const [, url] = /file (.+)/.exec(c);
    attributes.href = `file:///${path.resolve(
      Buffer.from(url, 'base64').toString(),
    )}`;
    // attributes.href = `file:///${Buffer.from(url, 'base64').toString()}`;
    attributes['data-type'] = 'file';
  } else {
    const [, url] = /fold (.+)/.exec(c);
    attributes.href = `file:///${path.resolve(
      Buffer.from(url, 'base64').toString(),
    )}`;
    // attributes.href = `file:///${Buffer.from(url, 'base64').toString()}`;
    attributes['data-type'] = 'folder';
  }
  attributes.class = `rich-text__link rich-text__link${`--${attributes['data-type']}`}`;
  return attributes;
};

export { parseLink };
export { LinkAttributes };
