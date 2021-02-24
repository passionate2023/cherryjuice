import { useState } from 'react';
import { useOnWindowResize } from '::hooks/use-on-window-resize';

const breakpoints = {
  mb: 425,
  tb: 850,
  wd: 1200,
};

const defaultBreakpoint = {
  mb: false,
  tb: false,
  md: false,
  mbOrTb: false,
  wd: false,
};

export type Breakpoint = {
  mb: boolean;
  tb: boolean;
  mbOrTb: boolean;
  md: boolean;
  wd: boolean;
};

const calculateCurrentBreakpoint = (windowWidth: number): Breakpoint => {
  const _breakpoint = { ...defaultBreakpoint };
  if (windowWidth <= breakpoints.mb) _breakpoint.mb = true;
  else if (windowWidth <= breakpoints.tb) {
    _breakpoint.tb = true;
  } else if (windowWidth <= breakpoints.wd) {
    _breakpoint.md = true;
  } else {
    _breakpoint.wd = true;
  }
  _breakpoint.mbOrTb = _breakpoint.mb || _breakpoint.tb;
  return _breakpoint;
};

export const useCurrentBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(defaultBreakpoint);
  useOnWindowResize([
    width => {
      const newBreakpoint = calculateCurrentBreakpoint(width);
      if (newBreakpoint !== breakpoint) setBreakpoint(newBreakpoint);
    },
  ]);
  return breakpoint;
};
