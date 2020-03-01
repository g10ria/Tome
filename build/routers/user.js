"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const user_1 = require("../models/user");
const bookshelf_1 = require("../models/bookshelf");
const bookclub_1 = require("../models/bookclub");
const requireAuth_1 = require("../middleware/requireAuth");
const userHelpers_1 = require("../helpers/userHelpers");
const bookshelfHelpers_1 = require("../helpers/bookshelfHelpers");
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
router.post("/bookshelves/createnew", async (ctx, next) => {
    let body = ctx.request.body;
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let bookshelf = new bookshelf_1.default({
        owner: user.id,
        name: body.name,
        description: body.description,
        src: body.src,
        books: []
    });
    await bookshelf.save();
    await user_1.default.update({ _id: user.id }, { $push: { bookshelves: bookshelf.id } });
    ctx.body = {
        owner: user.fullName,
        name: bookshelf.name,
        description: bookshelf.description,
        src: bookshelf.src,
        bookGIDs: bookshelf.books,
        stats: "You've finished 3 out of 6 books on this bookshelf." // todo: actually do this lol
    };
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
            bookGIDs: shelf.books,
            stats: "You've finished 3 out of 6 books on this bookshelf." // todo: actually do this lol
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
router.get("/bookclubs", async (ctx, next) => {
    await ctx.render("pages/clubs");
});
router.get("/bookclubs/all", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let ids = user.bookclubs;
    ids = ids.map(id => {
        return new mongodb_1.ObjectID(id);
    });
    let clubs = await bookclub_1.default.find({
        _id: { $in: ids }
    });
    let parsedClubs = [];
    // parse through each club and get the needed data
    // specifically, get the name of each bookshelf that's apart of the club
    for (let i = 0; i < clubs.length; i++) {
        // obtain an array of the names of the bookshelves in the club
        let shelfIDs = clubs[i].bookshelves;
        shelfIDs = shelfIDs.map(id => {
            return new mongodb_1.ObjectID(id);
        });
        let shelves = await bookshelf_1.default.find({
            _id: { $in: shelfIDs }
        });
        let bookshelves = shelves.map(shelf => { return shelf.name; });
        // aggregate the total number of books in the club
        let numBooks = 0;
        shelves.forEach(shelf => numBooks += shelf.books.length);
        // getting the name of the owner
        let owner = (await userHelpers_1.userFromID(new mongodb_1.ObjectID(clubs[i].owner))).fullName;
        // if they are the owner of this book club
        let isOwner = user.id == clubs[i].owner;
        parsedClubs.push({
            owner,
            name: clubs[i].name,
            description: clubs[i].description,
            bookshelves,
            numMembers: clubs[i].numMembers,
            numBooks,
            isOwner
        });
    }
    ctx.body = parsedClubs;
});
router.get("/bookclubs/search", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let ids = user.bookclubs;
    ids = ids.map(id => {
        return new mongodb_1.ObjectID(id);
    });
    // exact string match for name (case insensitive)
    let matchingClubs = await bookclub_1.default.find({
        $and: [
            {
                _id: { $nin: ids }
            },
            {
                name: { $regex: new RegExp(ctx.query.query, 'i') }
            }
        ]
    });
    let parsedMatchingClubs = [];
    for (let i = 0; i < matchingClubs.length; i++) {
        parsedMatchingClubs.push({
            owner: (await userHelpers_1.userFromID(new mongodb_1.ObjectID(matchingClubs[i].owner))).fullName,
            name: matchingClubs[i].name,
            numMembers: matchingClubs[i].numMembers,
            numBookshelves: matchingClubs[i].bookshelves.length
        });
    }
    ctx.body = parsedMatchingClubs;
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