import * as React from 'react';
import { User } from '::types/graphql/generated';
import { modUserPopup } from '::sass-modules';
import { Icon, Icons } from '::shared-components/icon/icon';

type Props = { user: User };

const UserInfo: React.FC<Props> = ({ user }) => {
  const { picture, email, firstName, lastName } = user;
  return (
    <div className={modUserPopup.user__info}>
      {picture ? (
        <img
          src={picture}
          alt="profile-picture"
          className={modUserPopup.user__info__picture}
        />
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
