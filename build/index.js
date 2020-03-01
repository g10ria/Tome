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
const user_1 = require("./routers/user");
const auth_1 = require("./routers/auth");
// import rejectAuth from './middleware/rejectAdmin'
const componentRegistration_1 = require("./helpers/componentRegistration");
// import config from "./config"
const app = new Koa();
const router = new Router();
const sessionConfig = {
    key: "thisisverysecure",
    maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days
};
app.keys = [
    "this", "is", "real", "security"
];
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
router.get("/login", async (ctx, next) => {
    if (!ctx.session || !ctx.session.username) {
        await ctx.render("pages/login");
    }
    else {
        await ctx.redirect("/user");
    }
});
router.get("/", async (ctx, next) => {
    if (!ctx.session || !ctx.session.username) {
        await ctx.render("pages/landing");
    }
    else {
        await ctx.redirect("/user");
    }
});
app.use(router.routes());
app.use(user_1.default.routes());
app.use(auth_1.default.routes());
app.use(serve('./static', {}));
app.listen(5000, () => {
    console.log("Server running on port 3000");
});
//# sourceMappingURL=index.js.map