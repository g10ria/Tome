import * as Koa from "koa";
import * as Router from "koa-router";

import User from "../models/user";
import Bookshelf from "../models/bookshelf"
import Bookclub from "../models/bookclub"

import requireAuth from '../middleware/requireAuth';

import { userFromUsername, userFromID } from '../helpers/userHelpers'
import { ObjectID } from "mongodb";

const router = new Router<Koa.DefaultState, Koa.Context>();
router.prefix("/bookclubs");

router.use(requireAuth);

router.get("/", async (ctx, next) => {
    await ctx.render("pages/clubs")
});

router.post("/createnew", async(ctx,next) => {
    let user = await userFromUsername(ctx.session.username)
    let owner = user.id
    let body = ctx.request.body
    let name = body.name
    let description = body.description
    let bookshelves = []
    let numMembers = 1

    let inserted = (await Bookclub.insertMany([{
        owner,
        name,
        description,
        bookshelves,
        numMembers
    }]))[0]

    await User.updateOne({_id:user.id}, { $push: { bookclubs: inserted.id } })

    console.log(inserted)
    ctx.body = inserted
})

router.post("/join", async (ctx, next) => {
    let user = await userFromUsername(ctx.session.username)
    let clubID = ctx.request.body.id
    let club = await Bookclub.findOne({ _id: clubID })

    await User.updateOne({ _id: user.id }, {
        $push: { bookclubs: clubID }
    })
    await Bookclub.updateOne({ _id: clubID }, { // increment numMembers by 1
        $inc: { numMembers: 1 }
    })

    // obtain an array of the names of the bookshelves in the club
    let ids = club.bookshelves
    let shelfIDs: ObjectID[] = ids.map(id => {
        return new ObjectID(id)
    })
    let shelves = await Bookshelf.find({
        _id: { $in: shelfIDs }
    })
    let bookshelves = shelves.map(shelf => { return shelf.name })

    // aggregate the total number of books in the club
    let numBooks = 0
    shelves.forEach(shelf => numBooks += shelf.books.length)

    // getting the name of the owner
    let owner = (await userFromID(new ObjectID(club.owner))).fullName

    ctx.body = ({
        owner,
        name: club.name,
        description: club.description,
        bookshelves,
        numMembers: club.numMembers + 1,
        numBooks,
        isOwner: false
    })
})

router.get("/all", async (ctx, next) => {
    let user = await userFromUsername(ctx.session.username)
    let clubIDs = user.bookclubs
    let ids: ObjectID[] = clubIDs.map(id => {
        return new ObjectID(id)
    })
    let clubs = await Bookclub.find({
        _id: { $in: ids }
    });

    let parsedClubs = []
    // parse through each club and get the needed data
    // specifically, get the name of each bookshelf that's apart of the club
    for (let i = 0; i < clubs.length; i++) {

        // obtain an array of the names of the bookshelves in the club
        let ids = clubs[i].bookshelves
        let shelfIDs: ObjectID[] = ids.map(id => {
            return new ObjectID(id)
        })
        let shelves = await Bookshelf.find({
            _id: { $in: shelfIDs }
        })
        let bookshelves = shelves.map(shelf => { return shelf.name })

        // aggregate the total number of books in the club
        let numBooks = 0
        shelves.forEach(shelf => numBooks += shelf.books.length)

        // getting the name of the owner
        let owner = (await userFromID(new ObjectID(clubs[i].owner))).fullName

        // if they are the owner of this book club
        let isOwner = user.id == clubs[i].owner

        parsedClubs.push({
            owner,
            name: clubs[i].name,
            description: clubs[i].description,
            bookshelves,
            numMembers: clubs[i].numMembers,
            numBooks,
            isOwner
        })
    }
    ctx.body = parsedClubs
})

router.get("/search", async (ctx, next) => {
    let user = await userFromUsername(ctx.session.username)
    let clubIDs = user.bookclubs
    let ids: ObjectID[] = clubIDs.map(id => {
        return new ObjectID(id)
    })

    // exact string match for name (case insensitive)
    let matchingClubs = await Bookclub.find({
        $and: [
            {
                _id: { $nin: ids }
            },
            {
                name: { $regex: new RegExp(ctx.query.query, 'i') }
            }
        ]
    })
    let parsedMatchingClubs = []
    for (let i = 0; i < matchingClubs.length; i++) {
        parsedMatchingClubs.push({
            owner: (await userFromID(new ObjectID(matchingClubs[i].owner))).fullName,
            name: matchingClubs[i].name,
            numMembers: matchingClubs[i].numMembers,
            numBookshelves: matchingClubs[i].bookshelves.length,
            id: matchingClubs[i].id
        })
    }
    ctx.body = parsedMatchingClubs
})

export default router