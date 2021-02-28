import { modDialogHeader } from '::shared-components/dialog/dialog-header';

const updateSubTitle = ({
  selectedScreenTitle,
}: {
  selectedScreenTitle: string;
}) => {
  const subTitleElement = document.querySelector(
    '.' + modDialogHeader.dialog__header__subTitle,
  );
  subTitleElement.innerHTML = selectedScreenTitle;
};

export { updateSubTitle };
