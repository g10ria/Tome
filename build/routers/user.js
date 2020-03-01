"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const user_1 = require("../models/user");
const requireAuth_1 = require("../middleware/requireAuth");
// import user from "../models/user";
const userHelpers_1 = require("../helpers/userHelpers");
const router = new Router();
router.prefix("/user");
router.use(requireAuth_1.default);
router.get("/", async (ctx, next) => {
    await ctx.render("pages/dash");
});
router.get("/bookshelves", async (ctx, next) => {
    await ctx.render("pages/bookshelves");
});
router.get("/books", async (ctx, next) => {
    await ctx.render("pages/booksread");
});
router.get("/bookclubs", async (ctx, next) => {
    await ctx.render("pages/clubs");
});
router.get("/journal", async (ctx, next) => {
    await ctx.render("pages/journal");
});
router.get("/journalentries", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    console.log(user.journalentries);
    ctx.body = user.journalentries;
});
router.post("/journal", async (ctx, next) => {
    let body = ctx.request.body;
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    await user_1.default.update({ _id: user.id }, { $push: { journalentries: body } });
    ctx.body = body;
});
// router.get("/dropins/all",
//     async (ctx, next) => {
//         const dropins = await Dropin.find({
//             booker: ctx.session.user._id,
//             isBooked: true,
//             startDate: {
//                 $gte: Date.now()
//             }
//         });
//         ctx.body = dropins;
//     }
// );
// router.get(
//     "/dropins",
//     async (ctx, next) => {
//         const objectId = ctx.request.query.id;
//         const dropin = await Dropin.find({ _id: objectId });
//         if (!dropin) {
//             ctx.throw(404, 'Dropin with specified id was not found.');
//         }
//         ctx.body = dropin;
//     }
// );
exports.default = router;
//# sourceMappingURL=user.js.map