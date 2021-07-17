import { LinkAttributes } from "./steps/helpers/parse-link";

export type AHtmlNodeAttributes = Record<string, string | number>;
export type AHtmlNode = {
  _?: string;
  $?: AHtmlNodeAttributes;
  type?: string;
  tags?: any[];
};
export type AHtmlLineAttributes = Record<string, any>;
export type AHtmlLine = [(AHtmlObject | AHtmlNode)[], AHtmlLineAttributes];

export type AHtmlObject = AHtmlNode & {
  other_attributes: Record<string, string>;
  linkAttributes?: LinkAttributes;
  table?: { td: string[][]; th: string[] };
  style: { height: string };
};
