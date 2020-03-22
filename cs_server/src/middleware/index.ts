var express = require('express');

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

export { addSTSHeader, ignoreClientSideRouting };
