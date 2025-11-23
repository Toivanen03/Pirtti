import User from '../models/User.js'
import bcrypt from 'bcryptjs'

export const checkFirstUser = async () => {
    try {
        const existing = await User.findOne()
        if (existing) {
            return
        }

        const passwordHash = await bcrypt.hash(process.env.FIRST_USER_PASSWORD, 10)
        await new User({
            email: process.env.USER_EMAIL,
            passwordHash,
            admin: true,
            notifications: true
        }).save()
        console.log("Pääkäyttäjä luotu")
    } catch (err) {
        console.error("Virhe: ", err)
    }
}