import { ObjectType, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { GetUserGql } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/graphql.guard';
import { Workspace } from './entities/workspace/workspace.entity';
import { Folder } from './entities/folder/folder.entity';
import { FoldersService } from './folders.service';

@ObjectType()
class UserMetaQueries {}

@UseGuards(GqlAuthGuard)
@Resolver(() => UserMetaQueries)
export class UserMetaQueriesResolver {
  constructor(
    private userService: UserService,
    private foldersService: FoldersService,
  ) {}

  @Query(() => UserMetaQueries)
  async userMeta(): Promise<Record<string, never>> {
    return {};
  }

  @ResolveField(() => Workspace)
  async workspace(
    @GetUserGql({ nullable: false }) user: User,
  ): Promise<Workspace> {
    return (await this.userService.getUserById(user.id)).workspace;
  }

  @ResolveField(() => [Folder])
  async folders(
    @GetUserGql({ nullable: false }) user: User,
  ): Promise<Folder[]> {
    return this.foldersService.getFolders({ userId: user.id });
  }

  @ResolveField(() => String)
  async id(@GetUserGql({ nullable: false }) user: User): Promise<string> {
    return user.id;
  }
}
