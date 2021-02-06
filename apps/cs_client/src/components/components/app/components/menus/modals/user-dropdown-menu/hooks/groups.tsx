import { ac } from '::store/store';
import { DropdownMenuGroupProps } from '::shared-components/dropdown-menu/components/dropdown-menu-group/dropdown-menu-group';
import { testIds } from '::cypress/support/helpers/test-ids';
import { UserInfo } from '::app/components/menus/modals/user/components/user-info';
import * as React from 'react';
import { User } from '@cherryjuice/graphql-types';
import { router } from '::root/router/router';

export const useGroups = ({
  user,
  documentId,
}: {
  online: boolean;
  documentId: string;
  user: User;
}): DropdownMenuGroupProps[] => {
  return user
    ? [
        {
          id: 'user-info',
          body: <UserInfo user={user} />,
        },
        {
          id: 'documents-and-preferences',
          header: {},
          body: [
            {
              text: 'bookmarks',
              onClick: ac.dialogs.showBookmarksDialog,
              disabled: !documentId,
            },
            {
              text: 'settings',
              onClick: ac.dialogs.showSettingsDialog,
              // testId:testIds.toolBar__navBar__showDocumentList,
              // dontShow: !isLoggedIn,
            },
            {
              text: 'sign out',
              onClick: ac.root.resetState,
              // dontShow: !isDocumentOwner,
              // disabled: noDocumentIsSelected
            },
          ],
        },
      ]
    : [
        {
          id: 'user',
          body: [
            {
              onClick: router.goto.signIn,
              text: 'sign in',
              testId: testIds.toolBar__userPopup__signIn,
            },
          ],
        },
      ];
};
