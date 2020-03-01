"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const user_1 = require("../models/user");
const bookshelf_1 = require("../models/bookshelf");
const requireAuth_1 = require("../middleware/requireAuth");
const userHelpers_1 = require("../helpers/userHelpers");
const mongodb_1 = require("mongodb");
const router = new Router();
router.prefix("/bookshelves");
router.use(requireAuth_1.default);
router.get("/", async (ctx, next) => {
    await ctx.render("pages/bookshelves");
});
router.post("/createnew", async (ctx, next) => {
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
        bookGIDs: bookshelf.books
    };
});
router.get("/all", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let shelfIDs = user.bookshelves;
    let ids = shelfIDs.map(id => {
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
router.get("/names", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let shelfIDs = user.bookshelves;
    let ids = shelfIDs.map(id => {
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
router.get("/explore", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
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
});
exports.default = router;
//# sourceMappingURL=bookshelves.js.map