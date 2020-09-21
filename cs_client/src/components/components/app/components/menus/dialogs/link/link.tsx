import * as React from 'react';
import { useEffect, useReducer } from 'react';
import { DialogWithTransition } from '::root/components/shared-components/dialog/dialog';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { MetaForm } from '::root/components/shared-components/form/meta-form/meta-form';
import { FormInputProps } from '::root/components/shared-components/form/meta-form/meta-form-input';
import { AlertType } from '::types/react';
import { useDelayedCallback } from '::hooks/react/delayed-callback';
import { TDialogFooterButton } from '::root/components/shared-components/dialog/dialog-footer';
import { ac, Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import {
  linkAC,
  linkR,
  linkRTC,
  LinkType,
} from '::root/components/app/components/menus/dialogs/link/reducer/reducer';
import { Select } from '::root/components/shared-components/inputs/select';
import { execK } from '::helpers/editing/execK';

const mapState = (state: Store) => ({
  showDialog: state.dialogs.showLinkDialog,
  selectedLink: state.editor.selectedLink,
  selection: state.editor.selection,
  isOnMd: state.root.isOnMd,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;
const LinkDialogWithTransition: React.FC<Props> = ({
  isOnMd,
  showDialog,
  selectedLink = '',
  selection,
}) => {
  const [state, dispatch] = useReducer(linkR, undefined, linkRTC);
  useEffect(() => {
    linkAC.init(dispatch);
  }, []);

  useEffect(() => {
    if (selectedLink) {
      linkAC.resetToEdit({
        url: selectedLink,
        type: LinkType.WEB_SITE,
        anchorId: '',
        node_id: '',
        location: '',
      });
    } else linkAC.resetToCreate();
  }, [showDialog, selectedLink]);
  const inputs: FormInputProps[] = [
    {
      customInput: (
        <Select
          options={[
            LinkType.WEB_SITE,
            LinkType.LOCAL_NODE,
            LinkType.FILE,
            LinkType.FOLDER,
          ]}
          onChange={linkAC.setLinkType}
          value={state.type}
        />
      ),
      label: 'type',
    },
  ];
  if (state.type === LinkType.LOCAL_NODE) {
    inputs.push({
      onChange: linkAC.setNodeId,
      value: state.node_id,
      type: 'text',
      label: 'node id',
    });
    inputs.push({
      onChange: linkAC.setAnchorId,
      value: state.anchorId,
      type: 'text',
      label: 'anchor',
    });
  } else if (state.type === LinkType.WEB_SITE) {
    inputs.push({
      onChange: linkAC.setUrl,
      value: state.url,
      type: 'text',
      label: 'url',
      lazyAutoFocus: !isOnMd && Boolean(showDialog),
    });
  } else
    inputs.push({
      onChange: linkAC.setLocation,
      value: state.location,
      type: 'text',
      label: 'location',
      lazyAutoFocus: !isOnMd && Boolean(showDialog),
    });
  const create = () => {
    try {
      let href;
      if (state.type === LinkType.WEB_SITE) {
        href = state.url;
      } else if (state.type === LinkType.LOCAL_NODE) {
        href = `${state.node_id}${
          state.anchorId ? `#${encodeURIComponent(state.anchorId)}` : ''
        }`;
      } else href = `file:///${state.location}`;
      execK({
        selection,
        tagName: 'a',
        attributes: [
          ['href', href],
          ['data-type', state.type],
          ['class', `rich-text__link rich-text__link--${state.type}`],
          ['target', 'black_'],
        ],
        mode: 'override',
      });
    } catch (e) {
      ac.dialogs.setAlert({
        title: 'Could not create the link',
        description: 'please refresh the page',
        type: AlertType.Error,
        error: e,
      });
    }
  };
  const edit = () => undefined;
  const apply = useDelayedCallback(
    ac.dialogs.hideLinkDialog,
    selectedLink ? edit : create,
  );

  const buttonsRight: TDialogFooterButton[] = [
    {
      label: 'dismiss',
      onClick: ac.dialogs.hideLinkDialog,
      disabled: false,
    },
    {
      label: 'apply',
      onClick: apply,
      disabled: !state.valid,
    },
  ];
  return (
    <DialogWithTransition
      dialogTitle={selectedLink ? 'Edit link' : 'Create link'}
      footRightButtons={buttonsRight}
      isOnMobile={isOnMd}
      show={Boolean(showDialog)}
      onClose={ac.dialogs.hideLinkDialog}
      onConfirm={apply}
      rightHeaderButtons={[]}
      small={true}
      isShownOnTopOfDialog={true}
    >
      <ErrorBoundary>
        <MetaForm inputs={inputs} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

const _ = connector(LinkDialogWithTransition);

export default _;
