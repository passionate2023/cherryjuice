import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../user/guards/graphql.guard';
import { UseGuards } from '@nestjs/common';
import { GetUserGql } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { SearchService } from './search.service';
import { SearchResultEntity } from './entities/search-result.entity';
import { NodeSearchIt } from './it/node-search.it';
import { NodeSearchResultEntity } from './entities/node.search-result.entity';

@UseGuards(GqlAuthGuard)
@Resolver(() => SearchResultEntity)
export class SearchResolver {
  constructor(private searchService: SearchService) {}

  @Query(() => SearchResultEntity)
  async search(): Promise<SearchResultEntity> {
    return new SearchResultEntity();
  }

  @ResolveField(() => [NodeSearchResultEntity])
  async node(
    @GetUserGql() user: User,
    @Args('searchArgs', { nullable: true, type: () => NodeSearchIt })
    searchArgs?: NodeSearchIt,
  ): Promise<NodeSearchResultEntity[]> {
    return this.searchService.nodeSearch({ it: searchArgs, user });
  }
}
