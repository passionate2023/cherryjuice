const createErrorDescription = {
  document: {
    doesNotExist: (documentId: string) =>
      JSON.stringify({
        errorId: 'cs::1',
        description: `document '${documentId}' does not exist in your library`,
      }),
    notEnoughAccessLevel: (documentId?: string) =>
      JSON.stringify({
        errorId: 'cs::2',
        description: `you don't have enough access level${
          documentId ? ` to document '${documentId}'` : ''
        }`,
      }),
  },
};

export { createErrorDescription };
