import express from 'express';
import logger from 'morgan';
import path from 'path';
import cors from 'cors';
import { addSTSHeader, ignoreClientSideRouting } from './middleware';
import { applyApollo } from './graphql';

const app = express();
app.use(logger('dev'));
if (process.env.NODE_ENV === 'production') app.use(addSTSHeader);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client')));
applyApollo(app);
app.use(ignoreClientSideRouting);
// app.use(createRouterPNG({resolversState}))

export { app };
