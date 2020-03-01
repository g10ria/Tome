import * as Koa from "koa";
import * as Router from "koa-router";

import * as validator from 'koa-joi-validate';
import * as Joi from 'joi';
import moment = require("moment");

import User from "../models/user";

import requireAuth from '../middleware/requireAuth';

const router = new Router<Koa.DefaultState, Koa.Context>();
router.prefix("/user");

router.use(requireAuth);

router.get("/", async (ctx, next) => {
    await ctx.render("pages/dash");
});

router.get("/bookshelves", async(ctx, next) => {
    await ctx.render("pages/bookshelves")
})

router.get("/booksread", async (ctx, next) => {
    await ctx.render("pages/booksread")
})

router.get("/clubs", async (ctx, next) => {
    await ctx.render("pages/clubs")
})

router.get("/journal", async (ctx, next) => {
    await ctx.render("pages/journal")
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