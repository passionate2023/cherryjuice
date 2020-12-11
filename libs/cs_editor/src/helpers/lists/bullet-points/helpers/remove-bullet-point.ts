import { getDeepestFirstChild } from '::helpers/execK/steps/restore-selection';

export const removeBulletPoint = (element: Element) => {
  const existingBPElement = getDeepestFirstChild(element) as Text;
  existingBPElement.replaceData(0, 2, '');
};
