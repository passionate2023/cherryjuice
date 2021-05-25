const pad = (digit: string | number) => String(digit).padStart(2, '0');

const dateToFormattedString = (date: Date) => {
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(
    date.getDate(),
  )} - ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const formatTime = (timestamp: number) =>
  dateToFormattedString(new Date(timestamp));

export { formatTime, dateToFormattedString };
