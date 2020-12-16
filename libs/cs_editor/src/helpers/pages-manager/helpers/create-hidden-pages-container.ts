export const createHiddenPagesContainer = () => {
  const container = document.createElement('div');
  container.style.visibility = 'hidden';
  container.setAttribute('id', 'hidden-pages-container');
  return container;
};
