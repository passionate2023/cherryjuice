// https://codepen.io/hardik-chaudhary/pen/GGjQyx
import * as React from 'react';
import { modToggleSwitch } from '::sass-modules';
import { useCallback } from 'react';

export const ToggleSwitch: React.FC<{
  value: boolean;
  onChange: (value: boolean) => void;
}> = ({ value, onChange }) => {
  const onChangeM = useCallback(e => {
    onChange(e.target.checked);
  }, []);
  return (
    <label className={modToggleSwitch.switch}>
      <input type="checkbox" checked={value} onChange={onChangeM} />
      <span className={modToggleSwitch.slider} />
    </label>
  );
};
