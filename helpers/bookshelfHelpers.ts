import Bookshelf from '../models/bookshelf'

export async function bookshelfFromID(id) {
    return await Bookshelf.findOne({ id })
}