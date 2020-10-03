import React from 'react';
import { Guests } from '::root/components/app/components/menus/dialogs/document-meta/components/guests/guests';
import { AccessLevel } from '::types/graphql';

export default { title: 'document-meta/guests' };

const guests = Array.from({ length: 5 }).map((_, i) => ({
  accessLevel: i === 0 ? AccessLevel.WRITER : AccessLevel.READER,
  userId: Date.now() + i + '',
  email: `user${i}@gmail.com`,
}));
export const withText = () => (
  <Guests guests={guests} userId={'userx@gmail.com'} />
);
