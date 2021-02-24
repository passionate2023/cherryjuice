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
  LinkState,
  LinkType,
} from '::root/components/app/components/menus/dialogs/link/reducer/reducer';
import { Select } from '::root/components/shared-components/inputs/select/select';
import { execK } from '@cherryjuice/editor';
import { useCurrentBreakpoint } from '::hooks/current-breakpoint';

const getAttributes = (
  state: LinkState,
  target: 'anchor' | 'image' = 'anchor',
): [string, string][] => {
  let href;
  if (state.type === LinkType.WEB_SITE) {
    href = state.url;
  } else if (state.type === LinkType.LOCAL_NODE) {
    href = `${state.node_id}${
      state.anchorId ? `#${encodeURIComponent(state.anchorId)}` : ''
    }`;
  } else href = `file:///${encodeURIComponent(state.location)}`;
  return [
    [target === 'anchor' ? 'href' : 'data-href', href],
    ['data-type', state.type],

    [
      'class',
      target === 'anchor'
        ? `rich-text__link rich-text__link--${state.type}`
        : `rich-text__image rich-text__image--link rich-text__image--link-${state.type}`,
    ],
    ['target', 'blank_'],
  ];
};

const mapState = (state: Store) => ({
  showDialog: state.dialogs.showLinkDialog,
  selectedLink: state.editor.selectedLink,
  selection: state.editor.selection,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;
const LinkDialogWithTransition: React.FC<Props> = ({
  showDialog,
  selectedLink,
  selection,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  const [state, dispatch] = useReducer(linkR, undefined, linkRTC);
  useEffect(() => {
    linkAC.init(dispatch);
  }, []);

  useEffect(() => {
    if (selectedLink?.href) {
      const type = selectedLink.type;
      let url = '',
        anchorId = '',
        node_id = '',
        location = '';
      if (type === LinkType.WEB_SITE) url = selectedLink.href;
      else if (type === LinkType.FOLDER || type === LinkType.FILE) {
        location = selectedLink.href.substring(8);
      } else if (type === LinkType.LOCAL_NODE) {
        selectedLink.href = selectedLink.href.replace(
          window.location.href.replace(/\d+$/, ''),
          '',
        );
        const res = /(\d+)#*(.+)?$/.exec(selectedLink.href);
        if (res) {
          const [, id, anchor] = res;
          node_id = id;
          anchorId = anchor || '';
        }
      }
      linkAC.resetToEdit({
        type: selectedLink.type,
        url,
        anchorId,
        node_id,
        location,
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
      lazyAutoFocus: !mbOrTb && Boolean(showDialog),
    });
  } else
    inputs.push({
      onChange: linkAC.setLocation,
      value: state.location,
      type: 'text',
      label: 'location',
      lazyAutoFocus: !mbOrTb && Boolean(showDialog),
    });
  const create = () => {
    try {
      execK({
        selection,
        tagName: 'a',
        attributes: getAttributes(state),
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
  const edit = () => {
    try {
      const attributes = getAttributes(
        state,
        selectedLink.target.localName === 'img' ? 'image' : 'anchor',
      );
      attributes.forEach(([k, v]) => {
        selectedLink.target.setAttribute(k, v);
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
  const apply = useDelayedCallback(
    ac.dialogs.hideLinkDialog,
    selectedLink?.href ? edit : create,
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
      isOnMobile={mbOrTb}
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
