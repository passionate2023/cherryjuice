declare module '*.css' {
  const css: any;
  export default css;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.png' {
  const data: any;
  export default data;
}
declare module '*.svg' {
  const data: any;
  export default data;
}
