import { LinkAttributes} from "@cherryjuice/ahtml-to-html";

const translateLinkType = {
  node: href => {
    if (/(\d+)#(.+)$/.test(href)) {
      const [, id, value] = href.match(/(\d+)#(.+)$/);
      return `node ${id} ${value}`;
    } else if (/\d+/.test(href)) {
      const [, id] = href.match(/(\d+)$/);
      return `node ${id}`;
    }
  },
  web: href => {
    return `webs ${href}`;
  },
  folder: href => {
    const [, value] = href.match(/file:\/\/\/(.+$)/);
    const encryptedValue = new Buffer(value).toString('base64');
    return `fold ${encryptedValue}`;
  },
  file: href => {
    const [, value] = href.match(/file:\/\/\/(.+$)/);
    const encryptedValue = new Buffer(value).toString('base64');
    return `file ${encryptedValue}`;
  },
};
const translateLink = (attributes: LinkAttributes): string => {
  const type = attributes['data-type'];
  const href = attributes.href;
  return translateLinkType[type](href);
};
export { translateLink };
