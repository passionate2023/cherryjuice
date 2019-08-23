import  express from "express";
import  cookieParser from "cookie-parser";
import  logger from "morgan";
import path from "path";
import { router } from "./routes";

const app = express();
app.use(logger("dev")) ;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use("/", router);

export { app };
