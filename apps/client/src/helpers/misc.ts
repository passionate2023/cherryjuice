const insertAt = xs => index => (x: any): void => xs.splice(index, 0, x);

// https://medium.com/@rajeshnaroth/writing-a-react-hook-to-cancel-promises-when-a-component-unmounts-526efabf251f
const makeCancelable = <T>(
  promise: Promise<T>,
): { cancel: Function; promise: Promise<T> } => {
  let isCanceled = false;
  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(val =>
      isCanceled ? reject(new Error('canceled')) : resolve(val),
    );
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
};

export { insertAt, makeCancelable };
