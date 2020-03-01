"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const user_1 = require("../models/user");
const bookshelf_1 = require("../models/bookshelf");
const requireAuth_1 = require("../middleware/requireAuth");
const userHelpers_1 = require("../helpers/userHelpers");
const bookshelfHelpers_1 = require("../helpers/bookshelfHelpers");
const mongodb_1 = require("mongodb");
const bookshelves_1 = require("./bookshelves");
const bookclubs_1 = require("./bookclubs");
const router = new Router();
router.prefix("/user");
router.use(requireAuth_1.default);
router.use(bookshelves_1.default.routes());
router.use(bookclubs_1.default.routes());
router.get("/", async (ctx, next) => {
    await ctx.render("pages/dash");
});
router.post("/book/addnew", async (ctx, next) => {
    let body = ctx.request.body;
    await bookshelf_1.default.updateOne({ _id: new mongodb_1.ObjectID(body.bookshelfID) }, { $push: { books: body.bookID } });
    let bookshelf = await bookshelf_1.default.findOne({ _id: new mongodb_1.ObjectID(body.bookshelfID) });
    let numBooks = bookshelf.books.length;
    let newBook = {
        bookshelf: bookshelf.id,
        index: numBooks - 1,
        status: body.status,
        // todo: test this
        date: body.status == "Finished reading" ? new Date().toISOString() : undefined
    };
    await user_1.default.update({ username: ctx.session.username }, { $push: { books: newBook } });
    ctx.body = "Book successfully added";
});
router.get("/books", async (ctx, next) => {
    await ctx.render("pages/booksread");
});
router.get("/books/all", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let parsedBooks = [];
    // getting the google ids of each book
    for (let i = 0; i < user.books.length; i++) {
        let bookshelf = await bookshelfHelpers_1.bookshelfFromID(new mongodb_1.ObjectID(user.books[i].bookshelf));
        let bookGID = bookshelf.books[user.books[i].index];
        parsedBooks.push({
            status: user.books[i].status,
            bookGID: bookGID,
            bookshelfName: bookshelf.name,
            date: user.books[i].date ? user.books[i].date : "-"
        });
    }
    ctx.body = parsedBooks;
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