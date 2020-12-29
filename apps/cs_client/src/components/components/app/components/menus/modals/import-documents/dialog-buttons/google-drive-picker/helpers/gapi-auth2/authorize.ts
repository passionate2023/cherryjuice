export type AuthorizeProps = {
  clientId: string;
};

export type AuthorizePreferences = {
  scope: string[];
  authImmediate;
};

export const authorize = (
  { clientId }: AuthorizeProps,
  { authImmediate, scope }: AuthorizePreferences = {
    authImmediate: true,
    scope: [
      'https://www.googleapis.com/auth/drive.metadata.readonly',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
  },
) => {
  return window.gapi['auth2'].init({
    client_id: clientId,
    scope: scope.join(' '),
    immediate: authImmediate,
  });
};
