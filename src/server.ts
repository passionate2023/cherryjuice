import  express from "express";
import  logger from "morgan";
import path from "path";
import cors from "cors";
import {createRouterPNG} from './routes/png';
import { resolversState } from './graphql';

const app = express();
app.use(logger("dev")) ;
app.use(cors()) ;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(createRouterPNG({resolversState}))

export { app };
