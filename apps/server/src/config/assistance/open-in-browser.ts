import open from 'open';

export const openInBrowser = async () => {
  await open(`http://localhost:${process.env.NODE_PORT}`).catch(
    () => undefined,
  );
};
