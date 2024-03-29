import { GraphQLScalarType } from 'graphql';
// https://stackoverflow.com/a/61714123/14193895
export const Void = new GraphQLScalarType({
  name: 'Void',

  description: 'Represents NULL values',

  serialize() {
    return null;
  },

  parseValue() {
    return null;
  },

  parseLiteral() {
    return null;
  },
});
