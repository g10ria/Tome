// import * as Koa from "koa";
// import * as Router from "koa-router";
// import findUser from '../helpers/auth/lookup'
// import rejectAuth from '../middleware/rejectAuth';
// import requireAuth from '../middleware/requireAuth';
// const router = new Router<Koa.DefaultState, Koa.Context>();
// router.prefix("/auth");
// router.get("/", rejectAuth, async (ctx, next) => {
//     await ctx.render("pages/login");
// });
// router.post("/", rejectAuth, async (ctx, next) => {
//     const body = ctx.request.body;
//     if (!body.username || typeof body.username != 'string')
//         ctx.throw(400, 'A username was not provided.');
//     if (!body.password || typeof body.password != 'string')
//         ctx.throw(400, 'A password was not provided.');
//     try {
//         ctx.session.user = await findUser(body.username, body.password)
//         ctx.body = "Login successful. Redirecting...";
//     } catch (e) {
//         console.log(e);
//         ctx.throw(400, "The username or password you entered did not match an account. Please try again.")
//     }
// });
// router.post("/logout", requireAuth, async (ctx, next) => {
//     // todo: actually logout
//     ctx.redirect("/");
// });
// export default router;
//# sourceMappingURL=auth.js.map