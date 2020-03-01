import * as Koa from "koa";
import * as Router from "koa-router";

import User from "../models/user";
import Bookshelf from "../models/bookshelf"
import Bookclub from "../models/bookclub"

import requireAuth from '../middleware/requireAuth';

import { userFromUsername, userFromID } from '../helpers/userHelpers'
import { bookshelfFromID } from '../helpers/bookshelfHelpers'
import { ObjectID } from "mongodb";

const router = new Router<Koa.DefaultState, Koa.Context>();
router.prefix("/bookshelves");

router.use(requireAuth);

router.get("/", async (ctx, next) => {
    await ctx.render("pages/bookshelves")
});

router.post("/createnew", async (ctx, next) => {
    let body = ctx.request.body
    let user = await userFromUsername(ctx.session.username)
    let bookshelf = new Bookshelf({
        owner: user.id,
        name: body.name,
        description: body.description,
        src: body.src,
        books: []
    })
    await bookshelf.save()
    await User.update(
        { _id: user.id },
        { $push: { bookshelves: bookshelf.id } }
    )
    ctx.body = {
        owner: user.fullName,
        name: bookshelf.name,
        description: bookshelf.description,
        src: bookshelf.src,
        bookGIDs: bookshelf.books
    }
})

router.get("/all", async (ctx, next) => {
    let user = await userFromUsername(ctx.session.username)
    let shelfIDs = user.bookshelves
    let ids = shelfIDs.map(id => {
        return new ObjectID(id)
    })
    let shelves = await Bookshelf.find({
        _id: { $in: ids }
    });

    // clean this
    let parsedShelves = []
    for (let i = 0; i < shelves.length; i++) {
        let shelf = shelves[i]
        let owner = await userFromID(new ObjectID(shelf.owner))   // get the name of the owner from their id

        parsedShelves.push({
            owner: owner.fullName,
            name: shelf.name,
            description: shelf.description,
            src: shelf.src,
            bookGIDs: shelf.books,
            stats: "You've finished 3 out of 6 books on this bookshelf." // todo: actually do this lol
        })
    }
    ctx.body = parsedShelves
})

router.get("/names", async (ctx, next) => {
    let user = await userFromUsername(ctx.session.username)
    let shelfIDs = user.bookshelves
    let ids: ObjectID[] = shelfIDs.map(id => {
        return new ObjectID(id)
    })
    let shelves = await Bookshelf.find({
        _id: { $in: ids }
    });
    let names = shelves.map(b => { return b.name })
    let shelfids = shelves.map(b => { return b.id })

    ctx.body = {
        names, ids: shelfids
    };
})

router.get("/explore", async (ctx, next) => {
    let user = await userFromUsername(ctx.session.username)
    // do this lol
    // let matchingClubs = await Bookclub.find({
    //     $and: [
    //         {
    //             _id: { $nin: ids }
    //         },
    //         {
    //             name: { $regex: new RegExp(ctx.query.query, 'i') }
    //         }
    //     ]
    // })
})

export default router