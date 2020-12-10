import { getSelection } from '::helpers/execK/steps/get-selection';
import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
import { getSelectedLines } from '::helpers/lists/bullet-points/helpers/get-selected-lines';

export const insertBulletPoint = () => {
  const selection = getSelection({ selectAdjacentWordIfNoneIsSelected: false });
  const selectedLines = getSelectedLines(selection);
};
