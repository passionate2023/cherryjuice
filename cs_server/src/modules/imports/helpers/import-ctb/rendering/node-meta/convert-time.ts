const convertTime = data =>
  Math.round((new Date(data * 1000) as unknown) as number);

export { convertTime };
