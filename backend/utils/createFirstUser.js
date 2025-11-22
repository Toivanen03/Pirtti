import User from '../models/User.js'
import bcrypt from 'bcryptjs'

export const checkFirstUser = async () => {
    try {
        const existing = await User.findOne()
        if (existing) {
            process.exit(0)
        }

        const passwordHash = bcrypt.hash(process.env.FIRST_USER_PASSWORD, 10)
        await new User({
            email: 'pkpirtti@protonmail.com',
            passwordHash,
            admin: true,
            notifications: true
        }).save()
        console.log("Pääkäyttäjä luotu")
        process.exit(0)
    } catch (err) {
        process.exit(1)
    }
}