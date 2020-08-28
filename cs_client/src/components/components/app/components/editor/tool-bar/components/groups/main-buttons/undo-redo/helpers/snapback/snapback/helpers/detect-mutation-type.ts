export enum MutationType {
  text = 'text',
  deletion = 'deletion',
  structure = 'structure',
  formatting = 'formatting',
  pasting = 'pasting',
  pastedImageMeta = 'pastedImageMeta',
}
export const detectMutationType = (
  mutations: MutationRecord[],
): MutationType => {
  if (mutations.every(mutation => mutation.type === 'characterData'))
    return MutationType.text;
  if (
    mutations.some(mutation =>
      mutation.attributeName?.startsWith('selection-start'),
    )
  )
    return MutationType.formatting;
  if (
    mutations.some(mutation =>
      mutation.attributeName?.startsWith('pselection-start'),
    )
  )
    return MutationType.pasting;
  if (
    mutations.every(
      mutation =>
        mutation.type === 'attributes' &&
        (mutation.target as HTMLElement).localName === 'img',
    )
  )
    return MutationType.pastedImageMeta;
  if (mutations.some(mutation => mutation.type === 'childList'))
    return MutationType.structure;
};
