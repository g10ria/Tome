"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const user_1 = require("../models/user");
const bookshelf_1 = require("../models/bookshelf");
const bookclub_1 = require("../models/bookclub");
const requireAuth_1 = require("../middleware/requireAuth");
const userHelpers_1 = require("../helpers/userHelpers");
const mongodb_1 = require("mongodb");
const router = new Router();
router.prefix("/bookclubs");
router.use(requireAuth_1.default);
router.get("/", async (ctx, next) => {
    await ctx.render("pages/clubs");
});
router.post("/join", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let clubID = ctx.request.body.id;
    let club = await bookclub_1.default.findOne({ _id: clubID });
    await user_1.default.updateOne({ _id: user.id }, {
        $push: { bookclubs: clubID }
    });
    await bookclub_1.default.updateOne({ _id: clubID }, {
        $inc: { numMembers: 1 }
    });
    // obtain an array of the names of the bookshelves in the club
    let ids = club.bookshelves;
    let shelfIDs = ids.map(id => {
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
    let owner = (await userHelpers_1.userFromID(new mongodb_1.ObjectID(club.owner))).fullName;
    ctx.body = ({
        owner,
        name: club.name,
        description: club.description,
        bookshelves,
        numMembers: club.numMembers + 1,
        numBooks,
        isOwner: false
    });
});
router.get("/all", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let clubIDs = user.bookclubs;
    let ids = clubIDs.map(id => {
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
        let ids = clubs[i].bookshelves;
        let shelfIDs = ids.map(id => {
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
router.get("/search", async (ctx, next) => {
    let user = await userHelpers_1.userFromUsername(ctx.session.username);
    let clubIDs = user.bookclubs;
    let ids = clubIDs.map(id => {
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
            numBookshelves: matchingClubs[i].bookshelves.length,
            id: matchingClubs[i].id
        });
    }
    ctx.body = parsedMatchingClubs;
});
exports.default = router;
//# sourceMappingURL=bookclubs.js.map