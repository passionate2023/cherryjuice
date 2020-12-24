const defaultScrollOptions: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'nearest',
  inline: 'nearest',
};
export const smoothScrollIntoView = (
  element: Element,
  options: Partial<ScrollIntoViewOptions> = defaultScrollOptions,
) => {
  element.scrollIntoView(options);
};
