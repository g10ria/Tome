import * as Koa from "koa";
import * as Router from "koa-router";

import User from "../models/user";
import Bookshelf from "../models/bookshelf"

import requireAuth from '../middleware/requireAuth';
// import user from "../models/user";

import { userFromUsername, userFromID } from '../helpers/userHelpers'
import { bookshelfFromID } from '../helpers/bookshelfHelpers'
import { ObjectID } from "mongodb";

const router = new Router<Koa.DefaultState, Koa.Context>();
router.prefix("/user");

router.use(requireAuth);

router.get("/", async (ctx, next) => {
    await ctx.render("pages/dash");
});

router.get("/bookshelves", async(ctx, next) => {
    await ctx.render("pages/bookshelves")
})

router.get("/bookshelves/all", async(ctx, next) => {
    let user = await userFromUsername(ctx.session.username)
    let ids = user.bookshelves
    ids = ids.map(id => {
        return new ObjectID(id)
    })
    let shelves = await Bookshelf.find({
        _id: { $in: ids }
    });
    
    // clean this
    let parsedShelves = []
    for(let i=0;i<shelves.length;i++) {
        let shelf = shelves[i]
        let owner = await userFromID(new ObjectID(shelf.owner))   // get the name of the owner from their id

        parsedShelves.push({
            owner: owner.fullName,
            name: shelf.name,
            description: shelf.description,
            src: shelf.src,
            stats: "You've read 3 out of 6 books on this list" // todo: actually do this lol
        })
    }
    ctx.body = parsedShelves
})

router.get("/bookshelves/names", async(ctx, next) => {
    let user = await userFromUsername(ctx.session.username)
    let ids = user.bookshelves
    ids = ids.map(id => {
        return new ObjectID(id)
    })
    let shelves = await Bookshelf.find({
        _id: { $in: ids }});
    let names = shelves.map(b => { return b.name})
    let shelfids = shelves.map(b => { return b.id})

     ctx.body = {
         names, ids: shelfids
     };
})

router.post("/book/addnew", async(ctx, next) => {
    let body = ctx.request.body

    console.log(body)

    await Bookshelf.updateOne({ _id: new ObjectID(body.bookshelfID) },
        {$push: { books: body.bookID }})

    let bookshelf = await Bookshelf.findOne({ _id: new ObjectID(body.bookshelfID) })
    console.log(bookshelf)

    let numBooks = bookshelf.books.length

    let newBook = {
        bookshelf: bookshelf.id,
        index: numBooks-1,
        status: body.status
    }
    await User.update(
        { username: ctx.session.username },
        { $push: { books: newBook } })

    ctx.body = "Book successfully added"
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