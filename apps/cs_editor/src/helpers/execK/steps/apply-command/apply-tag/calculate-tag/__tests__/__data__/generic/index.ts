import {
  alwaysToBeRemovedTags,
  sizeTags,
  styleTags,
} from '::helpers/execK/steps/apply-command/apply-tag/calculate-tag';
import { TTagTestSample } from '::helpers/execK/steps/apply-command/apply-tag/calculate-tag/__tests__/__data__';

const genTags = (tagsToBeExcluded: string[]) => (
  tagsToNotHaveAttributes: string[],
) =>
  [...sizeTags, ...styleTags, ...alwaysToBeRemovedTags]
    .filter(tagName => !tagsToBeExcluded.includes(tagName))
    .map(tagName => [
      tagName,
      tagsToNotHaveAttributes.includes(tagName) ? {} : { foo: `${tagName}` },
    ]);
const genInputAndOutput = ({
  tagName,
  remove = false,
  exists = true,
  excludedTagsInOutput = [],
}) => ({
  input: {
    tags: genTags(exists ? [] : [tagName])([tagName]),
    cmd: { tagName, remove },
  },
  output: genTags([
    /*remove
      ? [tagName]
      : */
    ...alwaysToBeRemovedTags,
    ...(sizeTags.includes(tagName) ? excludedTagsInOutput : []),
    ...(remove ? [tagName] : []),
  ])([tagName]),
});
const generateTestSamples = ({
  tagName,
  excludedTagsInOutput,
}: {
  tagName: string;
  excludedTagsInOutput: string[];
}) => {
  return [
    'apply non-existing',
    'apply existing',
    'remove non-existing',
    'remove existing',
  ]
    .map(testName => ({
      testName,
      tagName,
      remove: testName.includes('remove'),
      exists: !testName.includes('non-'),
      excludedTagsInOutput,
    }))
    .map(({ testName, tagName, exists, excludedTagsInOutput, remove }) => ({
      meta: { name: `${testName} ${tagName}` },
      ...genInputAndOutput({
        tagName,
        remove,
        exists,
        excludedTagsInOutput,
      }),
    }));
};

const getInput = tagName => ({
  tagName,
  excludedTagsInOutput: [...sizeTags.filter(tag => tag !== tagName)],
});
const genericTests: TTagTestSample[] = [...sizeTags, ...styleTags]
  .map(getInput)
  //@ts-ignore
  .flatMap(generateTestSamples);
export { genericTests };
