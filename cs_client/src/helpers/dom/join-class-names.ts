const joinClassNames = (classes: (string | [string, boolean])[]): string => {
  return classes
    .reduce((acc, className) => {
      if (className)
        if (typeof className === 'string') acc.push(className);
        else if (className[1]) acc.push(className[0]);

      return acc;
    }, [])
    .join(' ');
};

export { joinClassNames };
