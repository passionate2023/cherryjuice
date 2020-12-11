import { getSelection } from '::helpers/execK/steps/get-selection';
import { getSelectedLines } from '::helpers/lists/bullet-points/helpers/get-selected-lines';
import {
  BP,
  insertBulletPoint,
} from '::helpers/lists/bullet-points/helpers/insert-bullet-point';
import { removeBulletPoint } from '::helpers/lists/bullet-points/helpers/remove-bullet-point';

export const toggleBulletPoint = () => {
  const selection = getSelection({ selectAdjacentWordIfNoneIsSelected: false });
  const selectedLines = getSelectedLines(selection);
  selectedLines.forEach(line => {
    const lineHasBulletPoint = line.textContent.startsWith(BP);
    if (lineHasBulletPoint) {
      removeBulletPoint(line);
    } else {
      insertBulletPoint(line);
    }
  });
};
