import * as React from 'react';
import mod from './tabs.scss';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { DocumentNodes } from '::app/components/tabs/document-nodes/document-nodes';
import { Tooltip } from '@cherryjuice/components';
import { useRef } from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { Icon } from '@cherryjuice/icons';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    selectedNode_id: document?.persistedState?.selectedNode_id,
    showHome: state.home.show,
    isAuthenticated: !!state.auth.user?.id,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const Tabs: React.FC<Props & PropsFromRedux> = ({
  selectedNode_id,
  showHome,
  isAuthenticated,
}) => {
  const ref = useRef<HTMLDivElement>();
  // useEffect(() => {
  //   const handle = setInterval(() => {
  //     ref.current.scrollIntoView();
  //   }, 2000);
  //   return () => {
  //     clearInterval(handle);
  //   };
  // }, []);

  return (
    <div className={mod.tabs} ref={ref}>
      {isAuthenticated && (
        <div
          onClick={() => ac.home.show()}
          className={joinClassNames([
            mod.tabs__homeButton,
            [mod.tabs__homeButtonShowHome, showHome],
          ])}
        >
          <Tooltip {...{ label: 'home', position: 'bottom-right' }}>
            <Icon name={'home'} />
          </Tooltip>
        </div>
      )}
      {!!selectedNode_id && <DocumentNodes />}
    </div>
  );
};

const _ = connector(Tabs);
export { _ as Tabs };
