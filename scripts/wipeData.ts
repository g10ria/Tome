import User from '../models/user'
import Bookshelf from '../models/bookshelf'
import Bookclub from '../models/bookclub';


async function wipe() {
    await User.deleteMany({});
    await Bookshelf.deleteMany({});
    await Bookclub.deleteMany({});

    console.log("successfully wiped!")
    process.exit(0)
}

wipe()