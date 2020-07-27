import * as React from 'react';
import { modNodeMeta } from '::sass-modules/';
import { Privacy } from '::types/graphql/generated';
import { documentMetaActionCreators } from '::app/menus/document-meta/reducer/reducer';
import { useEffect, useRef } from 'react';
const options = [
  {
    value: Privacy.PRIVATE,
    label: 'private',
  },
  { value: Privacy.GUESTS_ONLY, label: 'guests' },
  { value: Privacy.PUBLIC, label: 'public' },
];

type Props = {
  privacy: Privacy;
};

const SelectPrivacy: React.FC<Props> = ({ privacy }) => {
  const ref = useRef<HTMLSelectElement>();
  useEffect(() => {
    ref.current.value = privacy;
  }, [privacy]);
  return (
    <select
      ref={ref}
      name={'select-privacy'}
      id=""
      className={modNodeMeta.nodeMeta__input__select}
      onChange={e =>
        documentMetaActionCreators.setPrivacy(e.target.value as Privacy)
      }
      defaultValue={privacy}
    >
      {options.map(({ value, label }) => (
        <option value={value} key={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export { SelectPrivacy };
