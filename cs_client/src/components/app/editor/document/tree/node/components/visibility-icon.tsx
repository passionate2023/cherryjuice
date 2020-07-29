import * as React from 'react';
import { NodePrivacy, Privacy } from '::types/graphql/generated';
import { joinClassNames } from '::helpers/dom/join-class-names';
import modIcons from '::sass-modules/tree/node.scss';
import { privacyIsBelow } from '::app/menus/document-meta/components/select-privacy/select-privacy';
import { VisibilityIcon } from '::app/editor/info-bar/components/components/visibility-icon';
import { memo } from 'react';

type Props = {
  documentPrivacy: Privacy;
  privacy: NodePrivacy;
  parentPrivacy: NodePrivacy;
};

const NodeVisibilityIcon: React.FC<Props> = memo(function NodeVisibilityIcon({
  documentPrivacy,
  privacy,
  parentPrivacy,
}) {
  const b = privacyIsBelow(parentPrivacy)(
    !privacy || privacy === NodePrivacy.DEFAULT ? documentPrivacy : privacy,
  );
  return (
    documentPrivacy !== Privacy.PRIVATE &&
    privacy !== NodePrivacy.PRIVATE && (
      <VisibilityIcon
        privacy={
          privacy && privacy !== NodePrivacy.DEFAULT ? privacy : documentPrivacy
        }
        className={joinClassNames([
          modIcons.node__titlePrivacy,
          [modIcons.node__titlePrivacyDisabled, b],
        ])}
      />
    )
  );
});

export { NodeVisibilityIcon };
