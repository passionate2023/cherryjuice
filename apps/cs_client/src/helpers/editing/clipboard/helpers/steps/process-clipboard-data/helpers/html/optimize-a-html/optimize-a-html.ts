import { cloneObj } from '::helpers/objects';
import { addEmptyLineBeforeHeader } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/helpers/add-empty-line-before-header';
import { cleanStyleAndRenameTags } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/helpers/clean-and-rename-tags';
import { transformStyles } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/helpers/transform-styles';
import { collapseTags } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/helpers/collapse-tags';

const optimizeAHtml = (
  { aHtml },
  options = { addEmptyLineBeforeHeader: true, keepClassAttribute: false },
) => {
  return cloneObj(aHtml)
    .reduce(
      options.addEmptyLineBeforeHeader
        ? addEmptyLineBeforeHeader
        : (acc, val) => (acc.push(val), acc),
      [],
    )
    .map(
      cleanStyleAndRenameTags({
        keepClassAttribute: options.keepClassAttribute,
      }),
    )
    .map(transformStyles)
    .map(collapseTags);
};

export { optimizeAHtml };
