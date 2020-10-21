import * as React from 'react';
import { AccessLevel, DocumentGuestOt } from '@cherryjuice/graphql-types';
import { testIds } from '::cypress/support/helpers/test-ids';
import { documentMetaActionCreators } from '::root/components/app/components/menus/dialogs/document-meta/reducer/reducer';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { Icons } from '::root/components/shared-components/icon/helpers/icons';
import { useMemo } from 'react';
import { apolloClient } from '::graphql/client/apollo-client';
import { USER_EXISTS } from '::graphql/queries/user-exists';
import { ac } from '::store/store';
import { AlertType } from '::types/react';
import { patterns } from '::root/components/auth/helpers/form-validation';
import { Chips } from '::root/components/app/components/menus/dialogs/document-meta/components/chips/chips';
import { AddChipCallback } from '::root/components/app/components/menus/dialogs/document-meta/components/chips/components/add-chip';
import { ChipProps } from '::root/components/app/components/menus/dialogs/document-meta/components/chips/components/chip';

type Props = {
  guests: DocumentGuestOt[];
  userId: string;
};

const Guests: React.FC<Props> = ({ guests, userId }) => {
  const chips = useMemo<ChipProps[]>(
    () =>
      guests.map(guest => ({
        additionalButton: (
          <ButtonCircle
            iconName={Icons.material.edit}
            small={true}
            active={guest.accessLevel === AccessLevel.WRITER}
            onClick={() =>
              documentMetaActionCreators.toggleUserAccessLevel(guest.userId)
            }
            testId={testIds.documentMeta__guestList__writeButton}
          />
        ),
        text: guest.email,
      })),
    [guests],
  );

  const addGuest: AddChipCallback = (email: string) =>
    apolloClient.mutate(USER_EXISTS({ email })).then(guestUserId => {
      if (guestUserId) {
        if (guestUserId === userId) {
          ac.dialogs.setAlert({
            type: AlertType.Neutral,
            title: "you can't add yourself as a guest",
            description: 'try a different email',
          });
          return { clearInput: false };
        } else {
          documentMetaActionCreators.addGuest({
            accessLevel: AccessLevel.READER,
            email,
            userId: guestUserId,
          });
          return { clearInput: true };
        }
      } else {
        ac.dialogs.setAlert({
          type: AlertType.Neutral,
          title: 'user does not exist',
          description: 'try a different email',
        });
        return { clearInput: false };
      }
    });

  return (
    <Chips
      label={'guests'}
      addChip={addGuest}
      placeholder={'guest email'}
      pattern={patterns.email.pattern}
      chips={chips}
      onRemove={documentMetaActionCreators.removeGuest}
    />
  );
};

export { Guests };
