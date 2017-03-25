import * as express from "express";
import {Express, Request, Response, Router} from "express";
import * as handlebars from "express-handlebars";
import * as path from "path";

export function dummyFunc() {
    return true;
}

let app: Express = express();
let router: Router = express.Router();
let hbs = (handlebars as any).create({
    extname: "html"
});
router.use("/*", function(req: Request, res: Response): void {
    res.render("./index.html");
});
app.engine("html", hbs.engine);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "..", "..", "client", "views"));
app.use(express.static(path.join(__dirname, "..", "..", "static")));
app.use(router);
app.listen(3000, () => {
    console.log("Listening for requests");
});