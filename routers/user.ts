import * as Koa from "koa";
import * as Router from "koa-router";

import User from "../models/user";
import Bookshelf from "../models/bookshelf"
import Bookclub from "../models/bookclub"

import requireAuth from '../middleware/requireAuth';

import { userFromUsername, userFromID } from '../helpers/userHelpers'
import { bookshelfFromID } from '../helpers/bookshelfHelpers'
import { ObjectID } from "mongodb";

import bookshelvesRouter from './bookshelves'
import bookclubsRouter from './bookclubs'

const router = new Router<Koa.DefaultState, Koa.Context>();
router.prefix("/user");

router.use(requireAuth);

router.use(bookshelvesRouter.routes())
router.use(bookclubsRouter.routes())

router.get("/", async (ctx, next) => {
    await ctx.render("pages/dash");
});

router.post("/book/addnew", async (ctx, next) => {
    let body = ctx.request.body

    await Bookshelf.updateOne({ _id: new ObjectID(body.bookshelfID) },
        { $push: { books: body.bookID } })

    let bookshelf = await Bookshelf.findOne({ _id: new ObjectID(body.bookshelfID) })

    let numBooks = bookshelf.books.length

    let newBook = {
        bookshelf: bookshelf.id,
        index: numBooks - 1,
        status: body.status,
        // todo: test this
        date: body.status == "Finished reading" ? new Date().toISOString() : undefined
    }
    await User.update(
        { username: ctx.session.username },
        { $push: { books: newBook } })

    ctx.body = "Book successfully added"
})

router.get("/books", async (ctx, next) => {
    await ctx.render("pages/booksread")
})

router.get("/books/all", async (ctx, next) => {
    let user = await userFromUsername(ctx.session.username)
    let parsedBooks = []
    // getting the google ids of each book
    for (let i = 0; i < user.books.length; i++) {
        let bookshelf = await bookshelfFromID(new ObjectID(user.books[i].bookshelf))
        let bookGID = bookshelf.books[user.books[i].index]
        parsedBooks.push({
            status: user.books[i].status,
            bookGID: bookGID,
            bookshelfName: bookshelf.name,
            date: user.books[i].date ? user.books[i].date : "-"
        })
    }
    ctx.body = parsedBooks
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