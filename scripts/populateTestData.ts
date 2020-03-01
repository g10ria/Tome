import User, { UserProps } from '../models/user'
import Bookshelf, { BookshelfProps } from '../models/bookshelf'
import Bookclub, { BookclubProps } from '../models/bookclub';

const TEST_USERS : UserProps[] = [
    {
        "fullName": "John Doe",
        "username": "johndoe",
        "password": "secret",
        "email": "22gloriaz@students.harker.org",
        "pfp": "https://pickaface.net/gallery/avatar/evercurio568e82bc0e0b3.png"
    },
    {
        "fullName": "The NY Times",
        "username": "nytimes",
        "password": "secret",
        "email": "22gloriaz@students.harker.org",
        "pfp": "https://upload.wikimedia.org/wikipedia/commons/4/40/New_York_Times_logo_variation.jpg"
    }
]

const TEST_BOOKSHELVES : BookshelfProps[] = [
    {
        "owner": "",    // set this to John Doe
        "name": "CS50 Extra Reading",
        "description": "Proident ullamco esse ullamco id labore sint incididunt aliquip ut. Ex proident laborum voluptate occaecat eiusmod. Voluptate aliquip labore deserunt ullamco aliquip et qui ex do consectetur id dolor culpa. Labore id officia reprehenderit nulla.",
        "src": "https://miro.medium.com/max/803/1*R2a-1b_kZpfS89PCdmMZYw.png",
        "books": []
    },
    {
        "owner": "",    // set this to NYTimes
        "name": "NYTimes Monthly Poetry",
        "description": "A monthly selection of poetry, hand-curated and selected by your jolly New York Times book editors. We hope you enjoy as much as we do!",
        "src": "https://images-na.ssl-images-amazon.com/images/I/31B-jyc2D5L._SY445_.jpg",
        "books": []
    }
]

const TEST_BOOKCLUBS : BookclubProps[] = [
    {
        "owner": "",    // set this to NYTimes
        "name": "NYTimes Initiative",
        "description": "Proident ullamco esse ullamco id labore sint incididunt aliquip ut. Ex proident laborum voluptate occaecat eiusmod. Voluptate aliquip labore deserunt ullamco aliquip et qui ex do consectetur id dolor culpa. Labore id officia reprehenderit nulla.",
        "bookshelves": [],
        "numMembers": 190
    }
]

async function populate() {
    await User.deleteMany({});
    await Bookshelf.deleteMany({});
    await Bookclub.deleteMany({});

    let insertedUsers = await User.insertMany(TEST_USERS)
    let johndoe = insertedUsers[0]
    let nytimes = insertedUsers[1]

    // populating bookclubs
    TEST_BOOKCLUBS[0].owner = nytimes.id
    let nytimesInitiative = (await Bookclub.insertMany(TEST_BOOKCLUBS))[0]

    // populating bookshelves
    TEST_BOOKSHELVES[0].owner = johndoe.id
    TEST_BOOKSHELVES[1].owner = nytimes.id
    let insertedBookshelves = await Bookshelf.insertMany(TEST_BOOKSHELVES)
    let cs50 = insertedBookshelves[0]
    let nytimesPoetry = insertedBookshelves[1]

    // add cs50 bookshelf to john doe
    await Bookclub.update(
        { _id: johndoe.id },
        { $push: { bookshelves: cs50.id }}
    )

    // add nytimes poetry bookshelf to nytimes bookclub
    await Bookclub.update(
        { _id: nytimes.id },
        { $push: { bookshelves: nytimesPoetry.id } }
    )

    // add nytimes bookclub to nytimes user
    await User.update(
        { $id: nytimes.id },
        { $push: {bookclubs: nytimesInitiative.id }}
    )

    console.log("successfully populated!")
    process.exit(0)
}

populate()