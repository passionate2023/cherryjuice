import { ApolloError } from 'apollo-client';
const useProperErrorMessage = (error: ApolloError): string => {
  let message;
  if (error) {
    if (error.graphQLErrors.length) {
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

export {useProperErrorMessage}
