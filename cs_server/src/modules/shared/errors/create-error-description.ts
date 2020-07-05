const createErrorDescription = {
  documentNotExist: (documentId: string) =>
    `cs::1::document '${documentId}' does not exist in your library`,
};

export { createErrorDescription };
