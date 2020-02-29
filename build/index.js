"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const json = require("koa-json");
const logger = require("koa-logger");
const views = require("koa-views");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const session = require("koa-session");
// import adminRouter from './routers/admin';
// import studentRouter from './routers/student';
// import authRouter from './routers/auth';
// import rejectAuth from './middleware/rejectAdmin'
const componentRegistration_1 = require("./helpers/componentRegistration");
// import config from "./config"
const app = new Koa();
const router = new Router();
const sessionConfig = {
    // key: config.auth.cookieKeys[0],
    maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days
};
// app.keys = config.auth.cookieKeys.slice(1);
app.use(session(sessionConfig, app));
app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(views(__dirname + '/../views', {
    map: {
        hbs: "handlebars"
    },
    extension: "hbs"
}));
componentRegistration_1.registerSingularComponent('./views/partials/head.hbs');
componentRegistration_1.registerSingularComponent('./views/partials/nav.hbs');
console.log(__dirname + '/../views');
router.get("/", async (ctx, next) => {
    await ctx.render("pages/dash");
});
app.use(router.routes());
// app.use(adminRouter.routes());
app.use(serve('./static', {}));
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
//# sourceMappingURL=index.js.map