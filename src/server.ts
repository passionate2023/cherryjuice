import  express from "express";
import  logger from "morgan";
import path from "path";
import { router } from "./routes";

const app = express();
app.use(logger("dev")) ;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use("/", router);

export { app };
