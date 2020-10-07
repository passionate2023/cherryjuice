import * as React from 'react';
import { modSearchResult } from '::sass-modules';
import { HighlightedHeadline } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/highlighted-headline';
import { Headlines } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';
import { NodeTags } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/node-tags';
type Props = {
  onClick?: () => void;
  headline?: Headlines;
  name: string;
  tags?: string;
};

const NodeNameAndTags: React.FC<Props> = ({
  name,
  tags,
  headline,
  onClick,
}) => {
  return (
    <div
      className={modSearchResult.searchResult__location__nodeName}
      onClick={onClick}
    >
      {headline?.nodeNameHeadline ? (
        <HighlightedHeadline headline={headline?.nodeNameHeadline} />
      ) : (
        name
      )}
      {headline?.tagsHeadline ? (
        <span style={{ marginLeft: 10 }}>
          <HighlightedHeadline headline={headline?.tagsHeadline} />
        </span>
      ) : (
        <NodeTags tags={tags} />
      )}
    </div>
  );
};

export { NodeNameAndTags };
