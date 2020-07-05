import { nodeStyleTestSamples } from './__data__/node-meta';
import { adaptNodeStyle } from '../adapt-node-meta';
import { nodeTitleStyle } from '../../../../../imports/helpers/import-ctb/rendering/node-meta/node-title-style';

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
