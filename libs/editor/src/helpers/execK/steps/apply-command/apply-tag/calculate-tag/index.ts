import { cloneObj } from '@cherryjuice/shared-helpers';
// @ts-ignore
import { TTag } from '::helpers/execK/steps/apply-command/apply-tag/calculate-tag/__tests__/__data__';
import { Attribute, ExecKMode } from '::helpers/execK';
const alwaysToBeRemovedTags = ['span'];
const sizeTags = ['h1', 'h2', 'h3', 'small', 'sup', 'sub'];
const styleTags = ['strong', 'em', 'code'];

const findExistingTag = ({
  tags,
  tagName,
}: {
  tags: TTag[];
  tagName: string;
}) => tags.find(([tag]) => tag === tagName);

const isSizeTag = (tagName: string) => sizeTags.includes(tagName);
const isRemovable = (tagName: string) =>
  alwaysToBeRemovedTags.includes(tagName);

const mergeStylesWithRootTag = ({
  tags,
  existingTag,
}: {
  tags: TTag[];
  existingTag: TTag;
}) => {
  if (!tags.length) tags.push(['span', {}]);
  if (existingTag[1].style)
    tags[0][1].style = {
      ...existingTag[1].style,
      ...(tags[0][1].style || {}),
    };
};
const removeTag = ({ tags, tagName }) => {
  const existingTag = findExistingTag({ tags, tagName });
  if (existingTag) {
    const indexOfTagToBeDeleted = tags.indexOf(existingTag);
    tags.splice(indexOfTagToBeDeleted, 1);
    mergeStylesWithRootTag({ tags, existingTag });
  }
};

const cleanTags = ({ tags, predicate }) => {
  tags
    .filter(([tagName]) => predicate(tagName))
    .forEach(([tagName]) => removeTag({ tags, tagName }));
};
const addTag = ({ tags, tagName, attributes }) => {
  if (!findExistingTag({ tagName, tags }))
    tags.push([tagName, attributes ? Object.fromEntries(attributes) : {}]);
};
const calculateTag = ({
  tags: oldTags,
  cmd: { remove, tagName, attributes, mode },
}: {
  tags: TTag[];
  cmd: {
    tagName: string;
    remove?: boolean;
    attributes: Attribute[];
    mode: ExecKMode;
  };
}) => {
  const tags = cloneObj(oldTags);
  if (isSizeTag(tagName)) cleanTags({ tags, predicate: isSizeTag });
  if (remove) {
    removeTag({ tags, tagName });
    if (mode === 'override') addTag({ tags, tagName, attributes });
  } else addTag({ tags, tagName, attributes });
  if (tags.length > 1) cleanTags({ tags, predicate: isRemovable });
  return tags;
};

export { calculateTag, sizeTags, styleTags, alwaysToBeRemovedTags };
