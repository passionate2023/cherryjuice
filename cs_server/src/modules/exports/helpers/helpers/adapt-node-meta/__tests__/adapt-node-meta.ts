import { nodeStyleTestSamples } from './__data__/node-meta';
import { nodeTitleStyle } from '../../../../../document/helpers';
import { adaptNodeStyle } from '../adapt-node-meta';

describe('adapt node title style', () => {
  it('should reverse node-title-style to rich_text and is_ro', () => {
    nodeStyleTestSamples.forEach(ogCtStyle => {
      const csStyle = ogCtStyle ? nodeTitleStyle(ogCtStyle) : undefined;
      const convertedCtStyle = adaptNodeStyle(csStyle);
      expect(convertedCtStyle).toEqual(
        ogCtStyle ? ogCtStyle : { is_richtxt: 1, is_ro: 0 },
      );
    });
  });
});
