import {
  Args,
  Mutation,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GetUserGql } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/graphql.guard';
import { Folder } from './entities/folder/folder.entity';
import { UpdateFolderIt } from './input-types/update-folder.it';
import { FoldersService } from './folders.service';
import { Void } from '../document/helpers/graphql-types/void';

@ObjectType()
class UserMetaMutations {}

@UseGuards(GqlAuthGuard)
@Resolver(() => UserMetaMutations)
export class UserMetaMutationsResolver {
  constructor(private foldersService: FoldersService) {}

  @Mutation(() => UserMetaMutations)
  async userMeta(): Promise<Record<string, never>> {
    return {};
  }

  @ResolveField(() => Void, { nullable: true })
  async createFolders(
    @GetUserGql({ nullable: false }) user: User,
    @Args({ name: 'folders', type: () => [Folder] })
    folders: Folder[],
  ): Promise<void> {
    await this.foldersService.createFolders({ userId: user.id, folders });
  }

  @ResolveField(() => Void, { nullable: true })
  async updateFolders(
    @GetUserGql({ nullable: false }) user: User,
    @Args({ name: 'folders', type: () => [UpdateFolderIt] })
    folders: UpdateFolderIt[],
  ): Promise<void> {
    await this.foldersService.updateFolders({ userId: user.id, folders });
  }

  @ResolveField(() => Void, { nullable: true })
  async removeFolders(
    @GetUserGql({ nullable: false }) user: User,
    @Args({ name: 'folderIds', type: () => [String] })
    folderIds: string[],
  ): Promise<void> {
    await this.foldersService.removeFolders({ userId: user.id, folderIds });
  }
}
