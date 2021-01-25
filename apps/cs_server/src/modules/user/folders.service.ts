import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateDefaultFoldersDTO,
  CreateFoldersDTO,
  FindUserFoldersDTO,
  FoldersRepository,
  RemoveFoldersDTO,
  UpdateFoldersDTO,
} from './repositories/folders.repository';
import { Folder } from './entities/folder/folder.entity';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(FoldersRepository)
    private foldersRepository: FoldersRepository,
  ) {}
  async createDefaultFolders(dto: CreateDefaultFoldersDTO): Promise<Folder[]> {
    return this.foldersRepository.createDefaultFolders(dto);
  }
  async getFolders(dto: FindUserFoldersDTO): Promise<Folder[]> {
    return this.foldersRepository.findAll(dto);
  }
  async getDraftsFolder(dto: FindUserFoldersDTO): Promise<Folder> {
    return this.foldersRepository.findOneOrFail({
      userId: dto.userId,
      name: 'Drafts',
    });
  }
  async createFolders(dto: CreateFoldersDTO): Promise<void> {
    return this.foldersRepository.createFolders(dto);
  }

  async removeFolders(dto: RemoveFoldersDTO): Promise<void> {
    return this.foldersRepository.removeFolders(dto);
  }
  async updateFolders(dto: UpdateFoldersDTO): Promise<void> {
    return this.foldersRepository.updateFolders(dto);
  }
}
