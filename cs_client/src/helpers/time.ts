const pad = number => (number < 10 ? `0${number}` : number);
const dateToFormattedString = date => {
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(
    date.getDate(),
  )} - ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const formatTime = x => dateToFormattedString(new Date(x));

export { formatTime, dateToFormattedString };
