export type AuthorizeProps = {
  clientId: string;
};

export type AuthorizePreferences = {
  scope: string[];
  authImmediate;
};

const defaultPreferences = {
  authImmediate: false,
  scope: [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
  ],
};

export const authorize = async (
  { clientId }: AuthorizeProps,
  { authImmediate, scope }: AuthorizePreferences = defaultPreferences,
) => {
  const googleAuth = await window.gapi['auth2'].init({
    client_id: clientId,
    scope: scope.join(' '),
    immediate: authImmediate,
  });
  const options = new window.gapi['auth2'].SigninOptionsBuilder();
  options.setAppPackageName('cherryjuice.app');
  options.setPrompt('select_account');
  scope.forEach(_scope => {
    options.setScope(_scope);
  });
  await googleAuth.signIn(options);
};
