export const blobToBase64 = (file: Blob): Promise<string> =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(event.target.result as string);
    };
    reader.readAsDataURL(file);
  });
