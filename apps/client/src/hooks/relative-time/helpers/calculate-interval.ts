export enum Times {
  second = 1000,
  minute = 60 * 1000,
  hour = 60 * 60 * 1000,
  day = 24 * 60 * 60 * 1000,
}

export const calculateInterval = (difference: number) => {
  if (difference < Times.hour) return Times.minute;
  else if (difference < Times.day) return Times.hour;
  else return undefined;
};
