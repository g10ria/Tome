import User from '../models/user'

export async function userFromUsername(username) {
    return await User.findOne({username})
}

export async function userFromID(id) {
    return await User.findOne({ _id: id })
}