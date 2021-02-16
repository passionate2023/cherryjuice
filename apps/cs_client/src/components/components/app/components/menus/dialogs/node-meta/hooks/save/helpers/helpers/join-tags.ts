export const joinTags = (tags: string[]): string | undefined =>
  tags
    .map(tag => tag.trim())
    .filter(Boolean)
    .join(', ');
