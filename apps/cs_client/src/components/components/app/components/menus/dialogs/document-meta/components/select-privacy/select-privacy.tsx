import * as React from 'react';
import { modNodeMeta } from '::sass-modules';
import { Privacy } from '::types/graphql';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { NodePrivacy } from '::types/graphql';

const privacyWeights = {
  [Privacy.PRIVATE]: 1,
  [Privacy.GUESTS_ONLY]: 2,
  [Privacy.PUBLIC]: 3,
};
export const privacyIsBelow = (a: Privacy | NodePrivacy) => (
  b: Privacy | NodePrivacy,
) => privacyWeights[a] < privacyWeights[b];
export const privacyIsBelowOrEqual = (a: Privacy | NodePrivacy) => (
  b: Privacy | NodePrivacy,
) => privacyWeights[a] <= privacyWeights[b];
export const lowestPrivacy = (a, b) =>
  privacyWeights[a] < privacyWeights[b] ? a : b;
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
  disabled?: boolean;
  maximumPrivacy?: Privacy;
  testId?: string;
};

const SelectPrivacy: React.FC<Props> = ({
  privacy,
  onChange,
  useNodeOptions,
  disabled,
  maximumPrivacy,
  testId,
}) => {
  const ref = useRef<HTMLSelectElement>();
  useEffect(() => {
    ref.current.value = privacy;
  }, [privacy]);
  const onChangeM = useCallback(
    e => {
      onChange(e.target.value as Privacy);
    },
    [onChange],
  );
  const isBelowDocumentPrivacy = useMemo(() => {
    return privacyIsBelowOrEqual(maximumPrivacy);
  }, [maximumPrivacy]);
  return (
    <select
      ref={ref}
      className={modNodeMeta.nodeMeta__input__select}
      onChange={onChangeM}
      defaultValue={privacy}
      disabled={disabled}
      data-testid={testId}
    >
      {(useNodeOptions ? nodeOptions : options).map(({ value, label }) => (
        <option
          value={value}
          key={value}
          disabled={isBelowDocumentPrivacy(value)}
        >
          {label}
        </option>
      ))}
    </select>
  );
};

export { SelectPrivacy };
