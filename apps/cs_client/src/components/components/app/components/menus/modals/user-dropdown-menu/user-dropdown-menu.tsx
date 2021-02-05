import * as React from 'react';
import { useGroups } from './hooks/groups';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { DropdownMenu } from '::shared-components/dropdown-menu/dropdown-menu';
import { testIds } from '::cypress/support/helpers/test-ids';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  online: state.root.online,
  user: state.auth.user,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = { hide: () => undefined };
const UserDropdownMenu: React.FC<Props & PropsFromRedux> = ({
  online,
  documentId,
  user,
  hide,
}) => {
  const elements = useGroups({ online, documentId, user });
  return (
    <DropdownMenu
      groups={elements}
      hide={hide}
      assertions={[
        {
          selector: `[data-testid="${testIds.toolBar__navBar__userButton}"]`,
        },
      ]}
    />
  );
};

const _ = connector(UserDropdownMenu);
export { _ as UserDropdownMenu };
