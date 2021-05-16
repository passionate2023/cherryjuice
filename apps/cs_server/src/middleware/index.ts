// eslint-disable-next-line @typescript-eslint/no-var-requires
const addSTSHeader = (req, res, next) => {
  res.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubdomains; preload',
  );
  return next();
};
const redirectToHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, ['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};
const contentTypes = {
  '/*.css': 'text/css',
  '/*.svg': 'image/svg+xml',
  '/*.js': 'application/javascript',
};
const sendCompressedJavascript = (req, res, next) => {
  if (req.url.indexOf('sw.js') === -1) {
    const compression = req.get('accept-encoding')?.includes('br')
      ? { ext: '.br', enc: 'br' }
      : { ext: '.gz', enc: 'gzip' };
    req.url = req.url + compression.ext;
    res.set('Content-Encoding', compression.enc);
    res.set('Content-Type', contentTypes[req.route.path]);
  }
  next();
};

export { addSTSHeader, sendCompressedJavascript, redirectToHTTPS };
