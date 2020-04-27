import { PubSub } from 'graphql-subscriptions';
enum SUBSCRIPTIONS {
  DOCUMENT = 'DOCUMENT',
}
const pubSub = new PubSub();

export { pubSub, SUBSCRIPTIONS };
