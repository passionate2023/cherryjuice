export const isInStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator['standalone'] ||
  document.referrer.includes('android-app://');
