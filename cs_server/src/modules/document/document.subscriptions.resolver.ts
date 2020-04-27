import { Resolver, Subscription } from '@nestjs/graphql';
import { Document } from './entities/document.entity';

import { Injectable, UseGuards } from '@nestjs/common';
import { DocumentSubscription } from './entities/document-subscription.entity';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { pubSub, SUBSCRIPTIONS } from '../shared/subscriptions';

@UseGuards(GqlAuthGuard)
@Injectable()
@Resolver(() => Document)
export class DocumentSubscriptionsResolver {
  @Subscription(() => DocumentSubscription)
  document() {
    return pubSub.asyncIterator(SUBSCRIPTIONS.DOCUMENT);
  }
}
