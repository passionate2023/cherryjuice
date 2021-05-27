export const clampTabs = (
  tabs: number[],
  selected_tab: number,
  numberOfVisibleTabs: number,
): [number[], number[]] => {
  if (numberOfVisibleTabs > tabs.length) return [tabs, []];
  else {
    const indexOfSelectedTab = tabs.findIndex(_tab => _tab === selected_tab);
    const indexOfLastVisibleTab = indexOfSelectedTab + numberOfVisibleTabs;

    let a, b;

    const showLeftEdge = indexOfSelectedTab < numberOfVisibleTabs;
    const showRightEdge = indexOfLastVisibleTab > tabs.length;
    if (showLeftEdge) {
      a = 0;
      b = numberOfVisibleTabs;
    } else if (showRightEdge) {
      a = tabs.length - numberOfVisibleTabs;
      b = tabs.length + 1;
    } else {
      a = indexOfSelectedTab - Math.floor(numberOfVisibleTabs / 2);
      b =
        indexOfSelectedTab +
        Math.floor(numberOfVisibleTabs / 2) +
        (numberOfVisibleTabs % 2);
    }
    const visible = tabs.slice(a, b);
    const invisibleLeft = tabs.slice(0, a);
    const invisibleRight = tabs.slice(b);

    return [visible, [...invisibleLeft, ...invisibleRight]];
  }
};
