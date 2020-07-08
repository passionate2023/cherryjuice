import { modDialog } from '::sass-modules/';

const updateSubTitle = ({
  selectedScreenTitle,
}: {
  selectedScreenTitle: string;
}) => {
  const subTitleElement = document.querySelector(
    '.' + modDialog.dialog__header__subTitle,
  );
  subTitleElement.innerHTML = selectedScreenTitle;
};

export { updateSubTitle };
