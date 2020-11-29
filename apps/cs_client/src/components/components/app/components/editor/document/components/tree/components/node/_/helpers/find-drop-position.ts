type Props = {
  anchorClassName: string;
  flag: string;
};
export const calculateDroppingPosition = ({ anchorClassName, flag }: Props) => (
  e,
): number => {
  let position = 0;
  const droppedThrough = e.nativeEvent.path[0];
  const actualTarget = e.currentTarget;
  const nodes = actualTarget
    ? Array.from(
        actualTarget.querySelectorAll(
          `:scope>div.${anchorClassName}:not([${flag}="true"])`,
        ),
      )
    : [];
  if (actualTarget.localName === 'ul') {
    if (droppedThrough !== actualTarget) {
      const above = e.nativeEvent.layerY / droppedThrough.clientHeight < 0.5;
      position = [
        nodes.indexOf(droppedThrough) + (above ? 0 : 1),
      ].map(position => Math.max(position, 0))[0];
    } else {
      position = nodes.length;
    }
  }
  return position;
};
