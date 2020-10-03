const getIconPath = async ({
  name,
  group,
}: {
  name: string;
  group: string;
}) => {
  const path = `${group}/${name}`;
  return {
    svg: await import(`::assets/icons/${path}.svg`).then(
      module => module.default,
    ),
    path: `/icons/${path}.svg`,
  };
};

export { getIconPath };
