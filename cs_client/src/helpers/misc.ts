const insertAt = xs => index => (x: any): void => xs.splice(index, 0, x);

export { insertAt };
