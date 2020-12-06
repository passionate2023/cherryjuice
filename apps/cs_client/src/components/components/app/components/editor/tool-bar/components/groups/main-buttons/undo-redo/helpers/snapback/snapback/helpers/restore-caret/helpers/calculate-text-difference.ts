export type Diff = { offset: number; length: number };

export const calculateTextDifference = (textA: string, textB: string): Diff => {
  let diffLength = 0;
  let diffOffset = 0;
  for (let i = 0; i < textA.length; i++) {
    const a = textA[i];
    const b = textB[i + diffLength];
    if (a !== b) {
      if (diffLength === 0) {
        diffOffset = i;
      }
      diffLength++;
    } else if (diffLength) {
      break;
    }
  }
  return { offset: diffOffset, length: diffLength };
};
