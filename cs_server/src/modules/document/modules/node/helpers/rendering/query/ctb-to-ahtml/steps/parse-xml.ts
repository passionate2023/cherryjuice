import { fixCharacters } from './fix-characters';
import { parseStringPromise } from 'xml2js';
const parseXml = async (xml: string): Promise<string> => {
  xml = fixCharacters.flagOrphanWhiteSpace(xml);
  let json: string = await parseStringPromise(xml).then(
    ({ node: { rich_text } }) => {
      return rich_text;
    },
  );
  json = fixCharacters.restoreOrphanWhiteSpace(json);
  return json;
};

export { parseXml };
