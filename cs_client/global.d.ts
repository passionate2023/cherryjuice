declare module '*.css' {
  const css: any;
  export default css;
}

declare module '*.scss' {
  const scss: any;
  export default scss;
}

declare module '*.png' {
  const data: any;
  export default data;
}
declare module '*.svg' {
  const data: any;
  export default data;
}

export {};
declare global {
  interface Window {
    google: any;
  }
}
