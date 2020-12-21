import * as React from 'react';
import { User } from '@cherryjuice/graphql-types';
import { modUserInfo } from '::sass-modules';

type Props = { user: User };

const UserInfo: React.FC<Props> = ({ user }) => {
  const { username } = user;
  return (
    <div className={modUserInfo.userInfo}>
      <span className={modUserInfo.userInfo__name}>
        signed in in as{' '}
        <span className={modUserInfo.userInfo__username}>{username}</span>
      </span>
    </div>
  );
};

export { UserInfo };
