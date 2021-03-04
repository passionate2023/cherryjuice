import { EntityRepository, Repository } from 'typeorm';
import { Folder } from '../entities/folder/folder.entity';
import { UpdateFolderIt } from '../input-types/update-folder.it';
import { FolderNotOwnedException } from '../exceptions/folder-not-owned.exception';

const validateAllFoldersBelongToUser = (userId: string, folders: Folder[]) => {
  const notOwnFolder = folders.find(folder => folder.userId === userId);
  if (!notOwnFolder) throw new FolderNotOwnedException(notOwnFolder.name);
};

export type FindUserFoldersDTO = { userId: string };
export type CreateDefaultFoldersDTO = FindUserFoldersDTO;
export type CreateFoldersDTO = FindUserFoldersDTO & {
  folders: Folder[];
};
export type RemoveFoldersDTO = FindUserFoldersDTO & {
  folderIds: string[];
};
export type UpdateFoldersDTO = FindUserFoldersDTO & {
  folders: UpdateFolderIt[];
};

@EntityRepository(Folder)
export class FoldersRepository extends Repository<Folder> {
  findAll({ userId }: FindUserFoldersDTO): Promise<Folder[]> {
    return this.find({ userId });
  }

  async createDefaultFolders({
    userId,
  }: CreateDefaultFoldersDTO): Promise<Folder[]> {
    const defaultFolders = ['Drafts'].map(name => new Folder({ name, userId }));
    await this.save(defaultFolders);
    return defaultFolders;
  }

  async createFolders({ userId, folders }: CreateFoldersDTO): Promise<void> {
    validateAllFoldersBelongToUser(userId, folders);

    await this.save(folders);
  }

  async removeFolders({ userId, folderIds }: RemoveFoldersDTO): Promise<void> {
    const folders = await this.findByIds(folderIds);
    validateAllFoldersBelongToUser(userId, folders);

    await this.remove(folders);
  }

  async updateFolders({
    userId,
    folders: changes,
  }: UpdateFoldersDTO): Promise<void> {
    const changesDict = Object.fromEntries(
      changes.map(change => {
        const id = change.id;
        delete change.id;
        return [id, change];
      }),
    );
    const folders = await this.findByIds(Object.keys(changesDict));
    validateAllFoldersBelongToUser(userId, folders);

    folders.forEach(folder => {
      Object.entries(changesDict[folder.id]).map(([k, v]) => {
        folder[k] = v;
      });
    });
    await this.save(folders);
  }
}
