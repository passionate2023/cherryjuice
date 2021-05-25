import * as React from 'react';
import { Privacy } from '@cherryjuice/graphql-types';
import { useMemo } from 'react';
import { NodePrivacy } from '@cherryjuice/graphql-types';
import { Select } from '::shared-components/inputs/select/select';

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
  const isBelowDocumentPrivacy = useMemo(() => {
    return privacyIsBelowOrEqual(maximumPrivacy);
  }, [maximumPrivacy]);
  return (
    <Select
      onChange={onChange}
      value={privacy}
      disabled={disabled}
      data-testid={testId}
      options={useNodeOptions ? nodeOptions : options}
      isOptionDisabled={isBelowDocumentPrivacy}
    />
  );
};

export { SelectPrivacy };
