import { SaveOperationProps } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { apolloClient } from '::graphql/client/apollo-client';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { newImagePrefix } from '::root/components/editor/components/content-editable/hooks/add-meta-to-pasted-images';
import { Image } from '@cherryjuice/graphql-types';
import { updateDocumentId } from '::store/epics/save-documents/helpers/save-document/helpers/shared';

const base64toBlob = ({ url, name }): Promise<Blob> =>
  fetch(url).then(async res => {
    if (url) {
      const blob = await res.blob();
      // @ts-ignore
      blob.name = name;
      return blob;
    }
  });
type SaveImagesProps = SaveOperationProps & {};
const saveImages = async ({ document, state }: SaveImagesProps) => {
  const nodes: [number, Image[]][] = Object.entries(
    document.localState.editedNodes.edited,
  ).reduce((acc, [node_id, attributes]) => {
    if (
      attributes.includes('image') &&
      !state.deletedNodes[document.id][node_id]
    ) {
      const images = document.nodes[node_id].image.filter(({ id }) =>
        id.startsWith(newImagePrefix),
      );
      if (images.length) {
        acc.push([node_id, images]);
      }
    }
    return acc;
  }, []);
  for await (const [node_id, images_] of nodes) {
    const node = updateDocumentId(state)(document.nodes[node_id]);
    const images: Blob[] = await Promise.all(
      Array.from(images_)
        .map(
          ({ id, base64 }) =>
            base64 && {
              name: id,
              url: `data:image/png;base64,${base64}`,
            },
        )
        .map(base64toBlob)
        .filter(Boolean),
    );
    const imageIdsTuples: [string, string][] = await apolloClient.mutate({
      query: DOCUMENT_MUTATION.uploadImages.query,
      variables: {
        node_id: node.node_id,
        file_id: node.documentId,
        images,
      },
      path: DOCUMENT_MUTATION.uploadImages.path,
    });

    if (imageIdsTuples?.length !== images.length)
      throw new Error('could not upload images');
    imageIdsTuples.forEach(([oldId, newId]) => {
      state.swappedImageIds[oldId] = newId;
    });
  }
};

export { saveImages };
