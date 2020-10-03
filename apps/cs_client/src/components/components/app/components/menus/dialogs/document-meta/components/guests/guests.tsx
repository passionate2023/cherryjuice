import * as React from 'react';
import { DocumentGuestOt } from '::types/graphql';
import { Guest } from '::root/components/app/components/menus/dialogs/document-meta/components/guests/components/guest';
import { modGuests } from '::sass-modules';
import { AddGuest } from '::root/components/app/components/menus/dialogs/document-meta/components/guests/components/add-guest';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { testIds } from '::cypress/support/helpers/test-ids';

type Props = {
  guests: DocumentGuestOt[];
  userId: string;
};

const Guests: React.FC<Props> = ({ guests, userId }) => {
  return (
    <div className={joinClassNames([modGuests.guests])}>
      <AddGuest userId={userId} />
      <div
        className={modGuests.guests__list}
        data-testid={testIds.documentMeta__guestList}
      >
        {guests.map(guest => (
          <Guest key={guest.email} guest={guest} />
        ))}
      </div>
    </div>
  );
};

export { Guests };
