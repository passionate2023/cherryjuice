const setCookie = (name: string, value: string, path = '/', days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name +
    '=' +
    encodeURIComponent(value) +
    '; expires=' +
    expires +
    '; path=' +
    path;
};

const getCookie = (name: string) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

const deleteCookie = (name: string, path = '/') => {
  setCookie(name, '', path);
};

export const cookie = {
  set: setCookie,
  get: getCookie,
  delete: deleteCookie,
};
