import { ApolloError } from 'apollo-client';

type ErrorOptions = { persistent?: boolean };
export type LocalError = { localMessage: string } & ErrorOptions;
export type AsyncError = (ApolloError & ErrorOptions) | LocalError;
const properErrorMessage = (error: AsyncError): string => {
  let message;
  if (error) {
    if ('localMessage' in error) message = error.localMessage;
    else if (
      error.graphQLErrors.length &&
      error.graphQLErrors[0]?.extensions?.exception?.response?.message
    ) {
      message = error.graphQLErrors[0].extensions.exception.response.message;
      if (Array.isArray(message)) message = message[0];
      if (message.startsWith('username:')) message = 'Invalid username';
      else if (message.startsWith('password:')) message = 'Invalid password';
      else if (message.startsWith('first-name:'))
        message = 'Invalid first name';
      else if (message.startsWith('last-name:')) message = 'Invalid last name';
      else if (message.startsWith('email')) message = 'Invalid last email';
    } else if (error.networkError) message = 'Network error';
  }
  return message;
};

export { properErrorMessage };
