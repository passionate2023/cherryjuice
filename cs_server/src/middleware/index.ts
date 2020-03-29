// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

const addSTSHeader = (req, res, next) => {
  res.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubdomains; preload',
  );
  return next();
};

const ignoreClientSideRouting = express.Router().get('*', (req, res) => {
  res.redirect('/');
});

const sendGzipezdJavascript = express
  .Router()
  .get('*.js', function(req, res, next) {
    if (req.url.indexOf('sw.js') === -1) {
      req.url = req.url + '.gz';
      res.set('Content-Encoding', 'gzip');
      res.set('Content-Type', 'application/javascript');
    }
    next();
  });

export { addSTSHeader, ignoreClientSideRouting, sendGzipezdJavascript };
