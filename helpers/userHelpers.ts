import User from '../models/user'

export async function userFromUsername(username) {
    return await User.findOne({username})
}