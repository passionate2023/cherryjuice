import { useMemo } from 'react';
import { SectionElementProps } from '::app/components/home/components/sidebar/components/sidebar-section/components/section-element/section-element';
import { CurrentFolder, Folder, FoldersDict } from '::store/ducks/home/home';
const folderSettings = {
  restrictions: {
    contextMenu: {
      Drafts: true,
      Recent: true,
    },
    dnd: {
      Recent: true,
    },
    renaming: {
      Drafts: true,
      Recent: true,
    },
  },
  categories: {
    default: {
      Drafts: true,
      Recent: true,
    },
  },
};

const mapFolderToSidebarElements = (currentFolder: CurrentFolder) => ({
  id,
  name,
  icon,
}: Folder): SectionElementProps => ({
  text: name,
  id,
  state: id === currentFolder.id ? 'opened' : undefined,
  icon,
  restrictions: {
    contextMenu: folderSettings.restrictions.contextMenu[name],
    dnd: folderSettings.restrictions.dnd[name],
    renaming: folderSettings.restrictions.renaming[name],
  },
});

export const useMapFolders = ({
  currentFolder,
  folders,
}: {
  currentFolder: CurrentFolder;
  folders: FoldersDict;
}) => {
  return useMemo(() => {
    if (!folders) return { userFolders: [], defaultFolders: [] };
    return Object.values(folders).reduce(
      (acc, val) => {
        if (folderSettings.categories.default[val.name])
          acc.defaultFolders.push(
            mapFolderToSidebarElements(currentFolder)(val),
          );
        else
          acc.userFolders.push(mapFolderToSidebarElements(currentFolder)(val));
        return acc;
      },
      { userFolders: [], defaultFolders: [] },
    );
  }, [currentFolder, folders]);
};
