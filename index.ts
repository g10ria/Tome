import * as Koa from "koa";
import * as Router from "koa-router";
import * as json from "koa-json";
import * as logger from "koa-logger";
import * as views from "koa-views";
import * as bodyParser from "koa-bodyparser"
import * as serve from 'koa-static'
import * as session from 'koa-session'

import User from './models/user'

// import adminRouter from './routers/admin';
import userRouter from './routers/user';
import authRouter from './routers/auth';

// import rejectAuth from './middleware/rejectAdmin'

import {
    registerSingularComponent
} from './helpers/componentRegistration'

// import config from "./config"

const app = new Koa();
const router = new Router<Koa.DefaultState, Koa.Context>();

const sessionConfig: Partial<session.opts> = {
    key: "thisisverysecure",
    maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days
}
app.keys = [
    "this", "is", "real", "security"
]

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

registerSingularComponent('./views/partials/head.hbs');
registerSingularComponent('./views/partials/nav.hbs');

router.get("/signup", async (ctx, next) => {
    if (!ctx.session || !ctx.session.username) {
        await ctx.render("pages/createaccount")
    } else {
        await ctx.redirect("/user")

    }});
router.get("/login", async (ctx, next) => {
    if (!ctx.session || !ctx.session.username) {
        await ctx.render("pages/login")
    } else {
        await ctx.redirect("/user")

    }})
router.post("/createnew", async (ctx, next) => {
    let body = ctx.request.body
    let user = await User.create([body])
    ctx.session.username = body.username
    ctx.body = user
})
router.get("/", async (ctx, next) => {
    if (!ctx.session || !ctx.session.username) {
        await ctx.render("pages/landing")
    } else {
        await ctx.redirect("/user")
    }
});

app.use(router.routes());
app.use(userRouter.routes());
app.use(authRouter.routes());

app.use(serve('./static', {}))

app.listen(5000, () => {
    console.log("Server running on port 3000");
});

