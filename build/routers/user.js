"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const requireAuth_1 = require("../middleware/requireAuth");
const router = new Router();
router.prefix("/user");
router.use(requireAuth_1.default);
router.get("/", async (ctx, next) => {
    await ctx.render("pages/dash");
});
router.get("/bookshelves", async (ctx, next) => {
    await ctx.render("pages/bookshelves");
});
router.get("/booksread", async (ctx, next) => {
    await ctx.render("pages/booksread");
});
router.get("/clubs", async (ctx, next) => {
    await ctx.render("pages/clubs");
});
router.get("/journal", async (ctx, next) => {
    await ctx.render("pages/journal");
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