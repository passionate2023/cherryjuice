import * as React from 'react';
import { AccessLevel, DocumentGuestOt } from '::types/graphql/generated';
import { modGuests } from '::sass-modules';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { Icons } from '::root/components/shared-components/icon/icon';
import { useCallback } from 'react';
import { documentMetaActionCreators } from '::root/components/app/components/menus/dialogs/document-meta/reducer/reducer';
import { testIds } from '::cypress/support/helpers/test-ids';

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
        testId={testIds.documentMeta__guestList__writeButton}
      />
      <ButtonCircle iconName={Icons.material.clear} onClick={removeGuestM} />
    </div>
  );
};

export { Guest };
