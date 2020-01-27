import { compose, tap } from 'ramda';
const R = { compose, tap };
const convert = data => new Date(Math.round(new Date(data * 1000) as unknown as number));
const pad = number => (number < 10 ? `0${number}` : number);
const dateToFormattedString = date =>
  `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(
    date.getDate()
  )} - ${pad(date.getHours())}:${pad(date.getMinutes())}`;
const formatTime = R.compose(
  dateToFormattedString,
  convert

);
export { formatTime, dateToFormattedString };
