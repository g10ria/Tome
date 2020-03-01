import * as Koa from "koa";
import * as Router from "koa-router";

import User from "../models/user";

import requireAuth from '../middleware/requireAuth';
// import user from "../models/user";

import { userFromUsername } from '../helpers/userHelpers'

const router = new Router<Koa.DefaultState, Koa.Context>();
router.prefix("/user");

router.use(requireAuth);

router.get("/", async (ctx, next) => {
    await ctx.render("pages/dash");
});

router.get("/bookshelves", async(ctx, next) => {
    await ctx.render("pages/bookshelves")
})

router.get("/books", async (ctx, next) => {
    await ctx.render("pages/booksread")
})

router.get("/bookclubs", async (ctx, next) => {
    await ctx.render("pages/clubs")
})

router.get("/journal", async (ctx, next) => {
    await ctx.render("pages/journal")
})

router.get("/journalentries", async (ctx, next) => {
    let user = await userFromUsername(ctx.session.username)
    console.log(user.journalentries)
    ctx.body = user.journalentries
})

router.post("/journal", async (ctx, next) => {
    let body = ctx.request.body
    let user = await userFromUsername(ctx.session.username)
    await User.update(
        { _id: user.id },
        { $push: { journalentries: body } }
    )
    ctx.body = body
})

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


export default router;