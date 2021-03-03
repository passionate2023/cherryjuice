import { useState } from 'react';
import { useOnWindowResize } from './on-window-resize';

const breakpoints = {
  mb: 425,
  tb: 850,
  wd: 1200,
};

export const defaultBreakpoint = {
  mb: false,
  tb: false,
  md: true,
  mbOrTb: false,
  wd: false,
  current: 'md' as CurrentBreakpoint,
};

type CurrentBreakpoint = 'mb' | 'tb' | 'md' | 'wd';
export type Breakpoint = {
  mb: boolean;
  tb: boolean;
  mbOrTb: boolean;
  md: boolean;
  wd: boolean;
  current: CurrentBreakpoint;
};

const calculateCurrentBreakpoint = (windowWidth: number): Breakpoint => {
  const _breakpoint = { ...defaultBreakpoint };
  if (windowWidth <= breakpoints.mb) {
    _breakpoint.mb = true;
    _breakpoint.current = 'mb';
  } else if (windowWidth <= breakpoints.tb) {
    _breakpoint.tb = true;
    _breakpoint.current = 'tb';
  } else if (windowWidth <= breakpoints.wd) {
    _breakpoint.md = true;
    _breakpoint.current = 'md';
  } else {
    _breakpoint.wd = true;
    _breakpoint.current = 'wd';
  }
  _breakpoint.mbOrTb = _breakpoint.mb || _breakpoint.tb;
  return _breakpoint;
};

export const useCurrentBreakpoint = (
  onChange?: (breakpoint: Breakpoint) => void,
) => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(defaultBreakpoint);
  useOnWindowResize([
    width => {
      const newBreakpoint = calculateCurrentBreakpoint(width);
      if (newBreakpoint !== breakpoint) {
        setBreakpoint(newBreakpoint);
        if (onChange) onChange(newBreakpoint);
      }
    },
  ]);
  return breakpoint;
};
