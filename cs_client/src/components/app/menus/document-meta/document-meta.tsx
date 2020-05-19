import * as React from 'react';
import { DialogWithTransition } from '::shared-components/dialog';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { MetaForm } from '::shared-components/form/meta-form/meta-form';
import { useCallback, useState } from 'react';
import { EventHandler } from 'react';
import { FormInputProps } from '::shared-components/form/meta-form/meta-form-input';
import { appActionCreators } from '::app/reducer';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { AlertType } from '::types/react';
import {
  generateNewDocument,
  generateRootNode,
} from '::app/menus/document-meta/helpers/new-document';

type DocumentMetaDialogProps = {};

const DocumentMetaDialogWithTransition: React.FC<DocumentMetaDialogProps & {
  onClose: EventHandler<any>;
  showDialog: boolean;
  isOnMobile: boolean;
}> = ({ showDialog, isOnMobile, onClose }) => {
  const [name, setName] = useState('new document');
  const inputs: FormInputProps[] = [
    {
      onChange: setName,
      value: name,
      type: 'text',
      label: 'Document name',
      lazyAutoFocus: 400,
      testId: 'document-name',
    },
  ];
  const apply = useCallback(() => {
    try {
      const document = generateNewDocument({ name });
      const rootNode = generateRootNode({ documentId: document.id });
      document.node.push(rootNode);
      apolloCache.node.create(rootNode);
      apolloCache.document.create(document.id, document);
      appActionCreators.selectFile(document.id);
    } catch (e) {
      appActionCreators.setAlert({
        title: 'Could not create a document',
        description: 'please refresh the page',
        type: AlertType.Error,
        error: e,
      });
    }

    appActionCreators.hideDocumentMetaDialog();
  }, [name]);
  const buttonsRight = [
    {
      label: 'dismiss',
      onClick: onClose,
      disabled: false,
    },
    {
      label: 'apply',
      onClick: apply,
      disabled: false,
    },
  ];
  return (
    <DialogWithTransition
      dialogTitle={'Document Properties'}
      dialogFooterLeftButtons={[]}
      dialogFooterRightButtons={buttonsRight}
      isOnMobile={isOnMobile}
      show={Boolean(showDialog)}
      onClose={onClose}
      onConfirm={apply}
      rightHeaderButtons={[]}
      small={true}
    >
      <ErrorBoundary>
        <MetaForm inputs={inputs} />
      </ErrorBoundary>
    </DialogWithTransition>
  );
};

export default DocumentMetaDialogWithTransition;
