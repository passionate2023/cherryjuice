import { TimeFilter, TimeRange } from '@cherryjuice/graphql-types';

const hourMs = 1000 * 60 * 60;
const dayMs = hourMs * 24;
const weekMs = dayMs * 7;
const monthMs = weekMs * 4 + 2 * dayMs;
const yearMs = monthMs * 12;

const mapRangeNameToTimeFilter = (rangeName: TimeRange): TimeFilter => {
  let rangeEnd = new Date().getTime();
  let rangeStart: number;
  if (rangeName === TimeRange.AnyTime) {
    rangeStart = 0;
    rangeEnd = 0;
  } else if (rangeName === TimeRange.PastHour) {
    rangeStart = rangeEnd - hourMs;
  } else if (rangeName === TimeRange.PastDay) {
    rangeStart = rangeEnd - dayMs;
  } else if (rangeName === TimeRange.PastWeek) {
    rangeStart = rangeEnd - weekMs;
  } else if (rangeName === TimeRange.PastMonth) {
    rangeStart = rangeEnd - monthMs;
  } else if (rangeName === TimeRange.PastYear) {
    rangeStart = rangeEnd - yearMs;
  }

  return { rangeStart, rangeEnd, rangeName };
};

export { mapRangeNameToTimeFilter };
