import * as React from 'react';
import { modNodeMeta } from '::sass-modules/index';
import { EventHandler } from 'react';
import { FormInput } from './components/form-input';
import { IconPicker } from '::app/menus/node-meta/components/icon-picker';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { useContext } from 'react';
import { RootContext } from '::root/root-context';
import { appActionCreators } from '::app/reducer';
import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { updatedCachedMeta } from '::app/editor/document/tree/node/helpers/apollo-cache';

type TNodeMetaModalProps = {
  nodeId: string;
  onClose: EventHandler<any>;
};
const NodeMetaModalWithTransition: React.FC<TNodeMetaModalProps & {
  showDialog: boolean;
  isOnMobile: boolean;
}> = ({ showDialog, isOnMobile, nodeId, onClose }) => {
  const {
    apolloClient: { cache },
  } = useContext(RootContext);
  // @ts-ignore
  const { name, node_title_styles, icon_id, read_only } = cache.data.get(
    'Node:' + nodeId,
  );
  const style = JSON.parse(node_title_styles);
  const isBold = style.fontWeight === 'bold';
  const hasCustomColor = style.color !== ('#ffffff' || 'rgb(255, 255, 255)');
  const hasCustomIcon = +icon_id !== 0;
  const [
    nameInput,
    isBoldInput,
    customColorValueInput,
    customIconValue,
    isReadOnlyInput,
    hasCustomColorInput,
    hasCustomIconInput,
  ] = Array.from({
    length: 7,
  }).map(() => React.createRef<HTMLInputElement>());
  const onSave = () => {
    const newStyle = JSON.stringify({
      color: hasCustomColorInput.current.checked
        ? customColorValueInput.current.value
        : '#ffffff',
      fontWeight: isBoldInput.current.checked ? 'bold' : 'normal',
    });
    const newIconId = !hasCustomIconInput.current.checked
      ? '0'
      : customIconValue.current.value;
    const res: { [k: string]: any } = {};
    if (nameInput.current.value !== name) res.name = nameInput.current.value;
    if (newStyle !== JSON.stringify(style)) res.node_title_styles = newStyle;
    if (newIconId !== icon_id) res.icon_id = newIconId;
    if (isReadOnlyInput.current.checked !== Boolean(read_only))
      res.read_only = isReadOnlyInput.current.checked;

    if (Object.keys(res)) updatedCachedMeta({ cache, nodeId, meta: res });
    documentActionCreators.setNodeMetaHasChanged(nodeId, Object.keys(res));
    appActionCreators.toggleNodeMeta();
  };
  const buttonsRight = [
    {
      label: 'dismiss',
      onClick: onClose,
      disabled: false,
    },
    {
      label: 'apply',
      onClick: onSave,
      disabled: false,
    },
  ];

  return (
    <DialogWithTransition
      dialogTitle={'Node Properties'}
      dialogFooterLeftButtons={[]}
      dialogFooterRightButtons={buttonsRight}
      isOnMobile={isOnMobile}
      show={showDialog}
      onClose={onClose}
      rightHeaderButtons={[]}
      small={true}
    >
      <ErrorBoundary>
        <div className={modNodeMeta.nodeMeta}>
          <FormInput
            defaultValue={name}
            type={'text'}
            inputRef={nameInput}
            label={'Node name'}
          />
          <FormInput
            defaultValue={isBold}
            type={'checkbox'}
            inputRef={isBoldInput}
            label={'Bold'}
          />
          <FormInput
            defaultValue={hasCustomColor}
            type={'checkbox'}
            label={'User selected color'}
            inputRef={hasCustomColorInput}
            additionalInput={({ disabled }) => (
              <input
                disabled={disabled}
                type={'color'}
                defaultValue={style.color}
                ref={customColorValueInput}
                className={`${modNodeMeta.nodeMeta__input__colorInput} ${
                  disabled ? modNodeMeta.nodeMeta__inputDisabled : ''
                }`}
              />
            )}
          />
          <FormInput
            defaultValue={hasCustomIcon}
            type={'checkbox'}
            inputRef={hasCustomIconInput}
            label={'User selected icon'}
            additionalInput={({ disabled }) => (
              <IconPicker
                selectedIcon={icon_id}
                disabled={disabled}
                inputRef={customIconValue}
              />
            )}
          />
          <FormInput
            defaultValue={read_only}
            type={'checkbox'}
            inputRef={isReadOnlyInput}
            label={'Read only'}
          />
        </div>
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default NodeMetaModalWithTransition;
