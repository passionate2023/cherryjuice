import { SaveOperationProps } from '::app/editor/document/hooks/save-document/helpers/save-deleted-nodes';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { localChanges } from '::graphql/cache/helpers/changes';
import { swapNodeIdIfApplies } from '::app/editor/document/hooks/save-document/helpers/save-nodes-meta';

const b64toBlob = ({ base64, id }): Promise<Blob> =>
  fetch(`data:image/png;base64,${base64}`).then(async res => {
    const blob = await res.blob();
    // @ts-ignore
    blob.name = id;
    return blob;
  });
type SaveImagesProps = SaveOperationProps & {};
const saveImages = async ({ state }: SaveImagesProps) => {
  const newImagesPerNode = apolloCache.changes.image.created;
  for await (const [nodeId, { base64 }] of Object.entries(newImagesPerNode)) {
    const node = apolloCache.node.get(swapNodeIdIfApplies(state)(nodeId));
    const images: Blob[] = await Promise.all(
      base64
        .map(id => apolloCache.image.get(id))
        .map(b64toBlob)
        .filter(Boolean),
    );
    const imageIdsTuples: [string, string][] = await apolloCache.client.mutate({
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
    apolloCache.changes.unsetModificationFlag(
      localChanges.IMAGE_CREATED,
      node.id,
    );
  }
};

export { saveImages };
