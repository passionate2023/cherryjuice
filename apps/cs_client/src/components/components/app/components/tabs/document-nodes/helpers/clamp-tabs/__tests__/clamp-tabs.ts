import { clampTabs } from '::app/components/tabs/document-nodes/helpers/clamp-tabs/clamp-tabs';

const data = {
  tabs: [12, 30, 35, 40, 41, 550, 3, 43, 44, 57, 93, 10],
};

describe('test tabs utils', () => {
  it('should show left side', () => {
    const [visible, invisible] = clampTabs(data.tabs, 12, 5);

    expect(visible).toEqual([12, 30, 35, 40, 41]);
    expect(invisible).toEqual([550, 3, 43, 44, 57, 93, 10]);
  });

  it('should show right side', () => {
    const [visible, invisible] = clampTabs(data.tabs, 44, 5);

    expect(visible).toEqual([43, 44, 57, 93, 10]);
    expect(invisible).toEqual([12, 30, 35, 40, 41, 550, 3]);
  });

  it('should show middle', () => {
    const [visible, invisible] = clampTabs(data.tabs, 3, 5);

    expect(visible).toEqual([41, 550, 3, 43, 44]);
    expect(invisible).toEqual([12, 30, 35, 40, 57, 93, 10]);
  });
});
