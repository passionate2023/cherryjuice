import { Args, Field, Resolver, Subscription } from '@nestjs/graphql';
import { Injectable, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { pubSub, SubscriptionChannels } from './subscriptions.service';
import { DocumentOperation } from './entities/document-operation.entity';

export class Subscriptions {
  @Field(() => DocumentOperation)
  documentOperation: DocumentOperation;
}

@UseGuards(GqlAuthGuard)
@Injectable()
@Resolver(() => Subscriptions)
export class SubscriptionsResolver {
  @Subscription(() => DocumentOperation, {
    filter: (payload: Subscriptions, variables) =>
      payload.documentOperation?.userId === variables.userId,
  })
  // eslint-disable-next-line no-unused-vars
  documentOperation(@Args('userId') userId: string) {
    return pubSub.asyncIterator(SubscriptionChannels.DOCUMENT);
  }
}
