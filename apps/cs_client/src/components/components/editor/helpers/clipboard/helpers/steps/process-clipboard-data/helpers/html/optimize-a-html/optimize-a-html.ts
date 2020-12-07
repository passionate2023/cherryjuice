import { cloneObj } from '::helpers/objects';
import { addEmptyLineBeforeHeader } from '::editor/helpers/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/helpers/add-empty-line-before-header';
import {
  cleanStyleAndRenameTags,
  CleanStyleAndRenameTagsProps,
} from '::editor/helpers/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/helpers/clean-and-rename-tags';
import { transformStyles } from '::editor/helpers/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/helpers/transform-styles';
import { collapseTags } from '::editor/helpers/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/helpers/collapse-tags';

export type OptimiseAHtmlOptions = CleanStyleAndRenameTagsProps & {
  noEmptyLineBeforeHeader?: boolean;
};

const optimizeAHtml = ({ aHtml }, options: OptimiseAHtmlOptions = {}) => {
  return cloneObj(aHtml)
    .reduce(
      options.noEmptyLineBeforeHeader
        ? (acc, val) => (acc.push(val), acc)
        : addEmptyLineBeforeHeader,
      [],
    )
    .map(cleanStyleAndRenameTags(options))
    .map(transformStyles)
    .map(collapseTags);
};

export { optimizeAHtml };
