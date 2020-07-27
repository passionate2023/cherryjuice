import * as React from 'react';
import { modNodeMeta } from '::sass-modules/';
import { Privacy } from '::types/graphql/generated';
import { useCallback, useEffect, useRef } from 'react';
import { NodePrivacy } from '::types/graphql/generated';

const options = [
  {
    value: Privacy.PRIVATE,
    label: 'private',
  },
  { value: Privacy.GUESTS_ONLY, label: 'guests' },
  { value: Privacy.PUBLIC, label: 'public' },
];
const nodeOptions = [
  { label: 'default', value: NodePrivacy.DEFAULT },
  ...options,
];

type Props = {
  privacy: Privacy | NodePrivacy;
  onChange: (privacy: Privacy | NodePrivacy) => void;
  useNodeOptions?: boolean;
};

const SelectPrivacy: React.FC<Props> = ({
  privacy,
  onChange,
  useNodeOptions,
}) => {
  const ref = useRef<HTMLSelectElement>();
  useEffect(() => {
    ref.current.value = privacy;
  }, [privacy]);
  const onChangeM = useCallback(e => {
    onChange(e.target.value as Privacy);
  }, []);
  return (
    <select
      ref={ref}
      className={modNodeMeta.nodeMeta__input__select}
      onChange={onChangeM}
      defaultValue={privacy}
    >
      {(useNodeOptions ? nodeOptions : options).map(({ value, label }) => (
        <option value={value} key={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export { SelectPrivacy };
