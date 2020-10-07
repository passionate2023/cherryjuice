import * as React from 'react';
import { modChips } from '::sass-modules';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { Icons } from '::root/components/shared-components/icon/icon';
import { useCallback } from 'react';

export type RemoveChipCallback = (id: string) => void;
export type ChipProps = {
  text: string;
  additionalButton?: JSX.Element;
};

const Chip: React.FC<ChipProps & { onRemove: RemoveChipCallback }> = ({
  text,
  onRemove,
  additionalButton,
}) => {
  const onRemoveM = useCallback(() => {
    onRemove(text);
  }, []);
  return (
    <div className={modChips.chips__chip}>
      {text}
      {additionalButton}
      <ButtonCircle
        iconName={Icons.material.clear}
        onClick={onRemoveM}
        small={true}
      />
    </div>
  );
};

export { Chip };
