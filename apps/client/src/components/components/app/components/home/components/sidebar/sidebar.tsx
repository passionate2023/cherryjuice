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
import { useMemo } from 'react';
import { ContextMenu } from '@cherryjuice/components';
import { deleteFolder } from '::app/components/home/components/sidebar/callbacks/delete-folder';
import { useInlineInputProvider } from '::shared-components/inline-input/hooks/inline-input-provider';

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
  const inputValues = useMemo(() => userFolders.map(folder => folder.text), [
    userFolders,
  ]);
  const inlineInputProps = useInlineInputProvider({
    inputValues,
    onApply: (id, value) => ac.home.setFolderName({ id, name: value.trim() }),
    onDiscard: id => ac.home.removeFolder({ id }),
  });
  const sharedSectionElementProps: SharedSectionElementProps = {
    onClick: id => ac.home.selectFolder({ id }),
  };
  const getContext = {
    getIdOfActiveElement: target => {
      const element: HTMLElement = target.closest(
        '.' + modSectionElement.sectionElement,
      );
      if (element) return element.dataset.id;
    },
    onSelectElement: () => undefined,
  };

  return (
    <ContextMenu
      getContext={getContext}
      items={[
        { name: 'rename', onClick: id => inlineInputProps.enableInput(id)() },
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
            sharedSectionElementProps={sharedSectionElementProps}
            inlineInputProps={inlineInputProps}
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
            sharedSectionElementProps={sharedSectionElementProps}
            inlineInputProps={inlineInputProps}
          />
        </div>
      )}
    </ContextMenu>
  );
};

const _ = connector(Sidebar);
export { _ as Sidebar };
