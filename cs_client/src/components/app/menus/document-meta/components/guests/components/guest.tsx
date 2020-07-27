import * as React from 'react';
import { AccessLevel, DocumentGuestOt } from '::types/graphql/generated';
import { modGuests } from '::sass-modules/';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { Icons } from '::shared-components/icon/icon';
import { useCallback } from 'react';
import { documentMetaActionCreators } from '::app/menus/document-meta/reducer/reducer';

type Props = {
  guest: DocumentGuestOt;
};

const Guest: React.FC<Props> = ({ guest: { email, accessLevel, userId } }) => {
  const toggleAccessLevelM = useCallback(() => {
    documentMetaActionCreators.toggleUserAccessLevel(userId);
  }, []);
  const removeGuestM = useCallback(() => {
    documentMetaActionCreators.removeGuest(userId);
  }, []);
  return (
    <div className={modGuests.guests__guest}>
      {email}
      <ButtonCircle
        iconName={Icons.material.edit}
        active={accessLevel === AccessLevel.WRITER}
        onClick={toggleAccessLevelM}
      />
      <ButtonCircle iconName={Icons.material.clear} onClick={removeGuestM} />
    </div>
  );
};

export { Guest };
