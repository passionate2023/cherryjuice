import { AuthUser } from '@cherryjuice/graphql-types';

const openConsentWindow = ({
  url,
  onAuth,
}: {
  url: string;
  onAuth: (authUser: AuthUser) => void;
}) => () => {
  window.open(
    url,
    '',
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no',
  );
  window.addEventListener('message', e => {
    if (e?.data?.authUser) {
      onAuth(e.data.authUser);
    }
  });
};

export { openConsentWindow };
