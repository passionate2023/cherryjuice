import { Image } from '@cherryjuice/graphql-types';

export const attachPageImages = (element: HTMLDivElement, images: Image[]) => {
  images.forEach(image => {
    const imageElement = element.querySelector(
      `img[data-id="${image.id}"]`,
    ) as HTMLImageElement;
    if (imageElement) {
      imageElement.setAttribute('src', `data:image/png;base64,${image.base64}`);
    }
  });
};
