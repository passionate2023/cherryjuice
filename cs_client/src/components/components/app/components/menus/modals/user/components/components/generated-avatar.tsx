import * as React from 'react';
import { modUserPopup } from '::sass-modules';
import { memo, useMemo } from 'react';

const colors = [
  '#2196f3',
  '#673ab7',
  '#e57373',
  '#e53935',
  '#f44336',
  '#880e4f',
  '#d81b60',
  '#f06292',
  '#4a148c',
  '#ab47bc',
  '#9c27b0',
  '#303f9f',
  '#5c6bc0',
  '#0d47a1',
  '#1976d2',
  '#42a5f5',
  '#01579b',
  '#006064',
  '#0097a7',
  '#004d40',
  '#00897b',
  '#4db6ac',
  '#1b5e20',
  '#43a047',
  '#33691e',
  '#7cb342',
  '#827717',
  '#f9a825',
  '#ff6f00',
  '#e65100',
  '#bf360c',
  '#5d4037',
  '#8d6e63',
  '#37474f',
  '#546e7a',
];

const getRandomColor = (text: string): string =>
  colors[
    +text
      .split('')
      .map(c => c.charCodeAt(0))
      .join('') % colors.length
  ];

const generateAvatar = (
  text,
  backgroundColor,
  size = 40,
  textSizeToWidthRatio = 0.3,
  textColor = 'white',
): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = canvas.width * textSizeToWidthRatio + 'px sans-serif';
  ctx.fillStyle = textColor;
  ctx.fillText(text, canvas.width * 0.5, canvas.height * 0.525);
  return canvas.toDataURL('png');
};

type Props = {
  firstName: string;
  lastName: string;
  id: string;
  className?: string;
  size?: number;
  textSizeToWidthRatio?: number;
};

const GeneratedAvatar: React.FC<Props> = memo(function GeneratedAvatar({
  firstName,
  lastName,
  id,
  className = '',
  size = 40,
  textSizeToWidthRatio = 0.3,
}) {
  const avatar = useMemo(
    () =>
      generateAvatar(
        (firstName.charAt(0) + '' + lastName.charAt(0)).toUpperCase(),
        getRandomColor(id),
        size,
        textSizeToWidthRatio,
      ),
    [firstName, lastName],
  );
  return (
    <img
      src={avatar}
      alt={'user avatar (a circle containing user initials)'}
      className={modUserPopup.user__info__generatedAvatar + ' ' + className}
    />
  );
});

export { GeneratedAvatar };
