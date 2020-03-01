import User from '../models/user';

export default async function findTestUser(casedUsername: string, password: string) {
    if (!casedUsername) throw new Error('Username was never defined');
    if (!password) throw new Error('Password was never defined');
    const username = casedUsername.toLowerCase();

    const user = await User.findOne({ username });
    if (user.password === password) return user;
    throw new Error();
}