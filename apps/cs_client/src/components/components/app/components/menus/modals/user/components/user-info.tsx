import * as React from 'react';
import { User } from '@cherryjuice/graphql-types';
import { modUserPopup } from '::sass-modules';
import { GeneratedAvatar } from '::root/components/app/components/menus/modals/user/components/components/generated-avatar';
import { Icon, Icons } from '@cherryjuice/icons';

type Props = { user: User };

const UserInfo: React.FC<Props> = ({ user }) => {
  const { picture, email, firstName, lastName, id } = user;
  return (
    <div className={modUserPopup.user__info}>
      {picture ? (
        <img
          src={picture}
          alt="profile-picture"
          className={modUserPopup.user__info__picture}
        />
      ) : id ? (
        <GeneratedAvatar firstName={firstName} lastName={lastName} id={id} />
      ) : (
        <Icon
          {...{
            name: Icons.material['person-circle'],
            size: 40,
            className: modUserPopup.user__info__picture,
          }}
        />
      )}

      <span className={modUserPopup.user__info__name}>
        {firstName} {lastName}
      </span>
      <span className={modUserPopup.user__info__email}>{email}</span>
    </div>
  );
};

export { UserInfo };
