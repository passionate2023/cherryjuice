// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as path from 'path';

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
const ignoreClientSideRouting = ({ staticAssetsRootFolder }) => {
  const assets = {
    ['index.html']: path.join(staticAssetsRootFolder, '/index.html'),
  };
  return (req, res) => {
    res.sendFile(assets['index.html']);
  };
};

const sendCompressedJavascript = (req, res, next) => {
  if (req.url.indexOf('sw.js') === -1) {
    req.url = req.url + '.br';
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'application/javascript');
  }
  next();
};

export {
  addSTSHeader,
  ignoreClientSideRouting,
  sendCompressedJavascript,
  redirectToHTTPS,
};
