export const BP = '• ';
export const insertBulletPoint = (element: Element) => {
  const bulletPointElement = document.createElement('span');
  bulletPointElement.innerText = BP;
  element.insertAdjacentElement('afterbegin', bulletPointElement);
};
