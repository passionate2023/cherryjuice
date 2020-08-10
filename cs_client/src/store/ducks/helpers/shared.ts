const createActionPrefixer = (duckName: string) => (actionName: string) =>
  `${duckName}::${actionName}`;

export { createActionPrefixer };
