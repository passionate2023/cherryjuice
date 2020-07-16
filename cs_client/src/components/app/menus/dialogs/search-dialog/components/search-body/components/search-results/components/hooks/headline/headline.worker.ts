import { generateHeadline } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-results/components/hooks/headline/helpers/generate-headline';
const ctx: Worker = self as any;

ctx.addEventListener('message', event => {
  const headline = generateHeadline(event.data);
  ctx.postMessage(headline);
});
