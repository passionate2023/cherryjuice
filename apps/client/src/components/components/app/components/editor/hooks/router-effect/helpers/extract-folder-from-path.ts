export type FolderInPath = {
  folder: string;
};

export const extractFolderFromPathname = (
  pathname = location.pathname,
): FolderInPath => {
  const params = /\/documents\/([^/]*)/.exec(pathname);
  const folder = params && params[1];
  return {
    folder,
  };
};
