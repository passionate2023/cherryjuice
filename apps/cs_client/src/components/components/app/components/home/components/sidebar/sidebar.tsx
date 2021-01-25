import * as React from 'react';
import mod from './sidebar.scss';
import { SidebarSection } from '::app/components/home/components/sidebar/components/sidebar-section/sidebar-section';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { useMapFolders } from '::app/components/home/components/sidebar/hooks/map-folders';
import {
  modSectionElement,
  SharedSectionElementProps,
} from '::app/components/home/components/sidebar/components/sidebar-section/components/section-element/section-element';
import { useMemo, useState } from 'react';
import { ContextMenuWrapper } from '::shared-components/context-menu/context-menu-wrapper';
import { deleteFolder } from '::app/components/home/components/sidebar/callbacks/delete-folder';

const mapState = (state: Store) => ({
  currentFolder: state.home.folder,
  folders: state.home.folders,
  draftsFolderId: state.home.draftsFolderId,
  userId: state.auth.user.id,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const Sidebar: React.FC<Props & PropsFromRedux> = ({
  currentFolder,
  folders,
  draftsFolderId,
  userId,
}) => {
  const { userFolders, defaultFolders } = useMapFolders({
    currentFolder,
    folders,
  });
  const [currentlyEnabledInput, setCurrentlyEnabledInput] = useState('');
  const sectionElementProps = useMemo(() => {
    const folderNames = new Set(userFolders.map(folder => folder.text));
    const sectionElementProps: SharedSectionElementProps = {
      checkValidity: value => !folderNames.has(value),
      currentlyEnabledInput,
      onToggleInputMode: id => void setCurrentlyEnabledInput(id),
      onClick: id => ac.home.selectFolder({ id }),
    };
    return sectionElementProps;
  }, [userFolders, currentlyEnabledInput]);

  const hookProps = {
    getIdOfActiveElement: target => {
      const element: HTMLElement = target.closest(
        '.' + modSectionElement.sectionElement,
      );
      if (element) return element.dataset.id;
    },
    onSelectElement: () => undefined,
  };

  return (
    <ContextMenuWrapper
      hookProps={hookProps}
      items={[
        { name: 'rename', onClick: setCurrentlyEnabledInput },
        {
          name: 'delete',
          onClick: id => deleteFolder({ folderId: id, draftsFolderId }),
        },
      ]}
    >
      {({ ref, show }) => (
        <div className={mod.sidebar} onContextMenu={show} ref={ref}>
          <SidebarSection
            topBorder={false}
            elements={defaultFolders}
            sharedSectionElementProps={sectionElementProps}
          />
          <SidebarSection
            topBorder={true}
            elements={userFolders}
            header={{
              text: 'ycnmhd',
              action: {
                icon: 'add',
                onClick: () => {
                  setTimeout(() => {
                    ac.home.createFolder({ userId });
                  }, 20);
                },
              },
            }}
            sharedSectionElementProps={sectionElementProps}
          />
        </div>
      )}
    </ContextMenuWrapper>
  );
};

const _ = connector(Sidebar);
export { _ as Sidebar };
