const Anchor = ({ other_attributes: { id } }) => `<img ${id ? `id="${id}"` : ''}
   class="rich-text__anchor"
   src="/icons/material/anchor.svg"
   alt="icon"/>`;

export { Anchor };
