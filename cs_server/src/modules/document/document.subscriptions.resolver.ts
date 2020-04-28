import { Args, Resolver, Subscription } from '@nestjs/graphql';
import { Document } from './entities/document.entity';

import { Injectable, UseGuards } from '@nestjs/common';
import { DocumentSubscription } from './entities/document-subscription.entity';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { pubSub, SUBSCRIPTIONS } from '../shared/subscriptions';

@UseGuards(GqlAuthGuard)
@Injectable()
@Resolver(() => Document)
export class DocumentSubscriptionsResolver {
  @Subscription(() => DocumentSubscription, {
    filter: (payload, variables) =>
      payload.document.userId === variables.userId,
  })
  // eslint-disable-next-line no-unused-vars
  document(@Args('userId') user: string) {
    return pubSub.asyncIterator(SUBSCRIPTIONS.DOCUMENT);
  }
}
