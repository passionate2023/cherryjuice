import express from 'express';
import logger from 'morgan';
import path from 'path';
import cors from 'cors';
import {
  addSTSHeader,
  ignoreClientSideRouting,
  sendGzipezdJavascript,
} from './middleware';
import { applyApollo } from './graphql';

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
applyApollo(app);
if (process.env.NODE_ENV === 'production')
{
  app.use(addSTSHeader);
  app.use(sendGzipezdJavascript);
}
app.use(express.static(path.join(__dirname, '../client')));
app.use(ignoreClientSideRouting);
// app.use(createRouterPNG({resolversState}))

export { app };
