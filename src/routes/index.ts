import express from 'express';

const router = express.Router();

router.post('/hello', function({ body }, res, next) {
  res.json({body})
});

export { router };
