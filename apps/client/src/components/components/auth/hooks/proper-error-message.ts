import { ApolloError } from '@apollo/client';

const properErrorMessage = (error: ApolloError): string => {
  let message = '';
  if (error) {
    if (error.graphQLErrors.length) {
      message = error.graphQLErrors[0].message;
      if (Array.isArray(message)) message = message[0];
    }
  }
  return message;
};

export { properErrorMessage };
