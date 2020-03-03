import { cloneObj } from '::helpers/execK/helpers';

const flattenAHtml = ({
  acc,
  aHtml
}: {
  acc: any[];
  aHtml: { tags: any[]; _: string };
}) => {
  const newAcc = cloneObj(acc);
  const chunks = aHtml.tags.reduce(
    (acc, val) => {
      if (val[0] === 'br') acc.push([]);
      else acc[acc.length - 1].push(val);
      return acc;
    },
    [[]]
  );
  chunks.forEach((chunk, i) => {
    newAcc.push({ ...(i === 0 ? { ...aHtml } : { _: '' }), tags: chunk });
    if (i < chunks.length - 1) newAcc.push('\n');
  });
  return { numberOfNewLines: chunks.length - 1, newAcc };
};

export { flattenAHtml };
