"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const userLookup_1 = require("../helpers/userLookup");
const rejectAuth_1 = require("../middleware/rejectAuth");
const requireAuth_1 = require("../middleware/requireAuth");
const router = new Router();
router.prefix("/auth");
router.get("/", rejectAuth_1.default, async (ctx, next) => {
    await ctx.render("pages/login");
});
router.post("/", rejectAuth_1.default, async (ctx, next) => {
    const body = ctx.request.body;
    if (!body.username || typeof body.username != 'string')
        ctx.throw(400, 'A username was not provided.');
    if (!body.password || typeof body.password != 'string')
        ctx.throw(400, 'A password was not provided.');
    try {
        ctx.session.username = (await userLookup_1.default(body.username, body.password)).username;
        ctx.body = "Login successful. Redirecting...";
    }
    catch (e) {
        console.log(e);
        ctx.throw(400, "The username or password you entered did not match an account. Please try again.");
    }
});
router.post("/logout", requireAuth_1.default, async (ctx, next) => {
    delete ctx.session.username;
});
exports.default = router;
//# sourceMappingURL=auth.js.map