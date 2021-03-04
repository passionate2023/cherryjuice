import { ApolloError } from 'apollo-server-express';

export class MustUseThirdPartyToLoginException extends ApolloError {
  constructor(thridParty: string) {
    super(`Please use ${thridParty} to login`);
  }
}
