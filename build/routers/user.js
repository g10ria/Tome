"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const user_1 = require("../models/user");
const bookshelf_1 = require("../models/bookshelf");
const requireAuth_1 = require("../middleware/requireAuth");
// import user from "../models/user";
const userHelpers_1 = require("../helpers/userHelpers");
const mongodb_1 = require("mongodb");
const router = new Router();
router.prefix("/user");
router.use(requireAuth_1.default);
router.get("/", async (ctx, next) => {
    await ctx.render("pages/dash");
});
router.get("/bookshelves", async (ctx, next) => {
    await ctx.render("pages/bookshelves");
});
router.get("/bookshelves/all", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let ids = user.bookshelves;
    ids = ids.map(id => {
        return new mongodb_1.ObjectID(id);
    });
    let shelves = await bookshelf_1.default.find({
        _id: { $in: ids }
    });
    // clean this
    let parsedShelves = [];
    for (let i = 0; i < shelves.length; i++) {
        let shelf = shelves[i];
        let owner = await userHelpers_1.userFromID(new mongodb_1.ObjectID(shelf.owner)); // get the name of the owner from their id
        parsedShelves.push({
            owner: owner.fullName,
            name: shelf.name,
            description: shelf.description,
            src: shelf.src,
            stats: "You've read 3 out of 6 books on this list" // todo: actually do this lol
        });
    }
    ctx.body = parsedShelves;
});
router.get("/bookshelves/names", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let ids = user.bookshelves;
    ids = ids.map(id => {
        return new mongodb_1.ObjectID(id);
    });
    let shelves = await bookshelf_1.default.find({
        _id: { $in: ids }
    });
    let names = shelves.map(b => { return b.name; });
    let shelfids = shelves.map(b => { return b.id; });
    ctx.body = {
        names, ids: shelfids
    };
});
router.post("/book/addnew", async (ctx, next) => {
    let body = ctx.request.body;
    console.log(body);
    await bookshelf_1.default.updateOne({ _id: new mongodb_1.ObjectID(body.bookshelfID) }, { $push: { books: body.bookID } });
    let bookshelf = await bookshelf_1.default.findOne({ _id: new mongodb_1.ObjectID(body.bookshelfID) });
    console.log(bookshelf);
    let numBooks = bookshelf.books.length;
    let newBook = {
        bookshelf: bookshelf.id,
        index: numBooks - 1,
        status: body.status
    };
    await user_1.default.update({ username: ctx.session.username }, { $push: { books: newBook } });
    ctx.body = "Book successfully added";
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
    ctx.body = user.journalentries;
});
router.post("/journal", async (ctx, next) => {
    let body = ctx.request.body;
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    await user_1.default.update({ _id: user.id }, { $push: { journalentries: body } });
    ctx.body = body;
});
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